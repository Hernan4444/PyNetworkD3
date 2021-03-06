"""Core module for the package. It holds the main object to be used."""

import copy
import warnings
import zipfile
from string import Template
from urllib.parse import quote as urllib_quote

from .kws import LegendHoverKws, LinkLineKws, LinkRectKws, NodeCircleKws
from .utils import bool_js, read, replace_dict


class Base:
    def __init__(self, data, width, height, chart, view_box):
        self.tooltip = None
        self.width = width
        self.height = height
        self.view_box = bool_js(view_box)
        self.canvas = bool_js(False)
        self.main_js = read("main.js")
        self.chart_js = Template(read("code.js", chart)).safe_substitute(
            main=self.main_js
        )
        self.style = read("style.css", chart)
        self.aux_functions = ""
        self.dataset = replace_dict(copy.deepcopy(data), None, "null")
        self.aux_functions_name = []

    def export(self, path):
        with open(path, "w", encoding="utf-8") as file:
            file.write(self.get_html())

    def export_multiples_file(self, path):
        html = read("export_main.html")
        self.aux_functions = ""
        js = (
            Template(self.chart_js)
            .safe_substitute(**self.__dict__)
            .replace("None", "null")
        )
        js = Template(js).safe_substitute(data=self.dataset)
        self.load_aux_functions()
        with zipfile.ZipFile(path + ".zip", "w") as z:
            z.writestr("main.html", html)
            z.writestr("main.js", js)
            z.writestr("utils.js", self.aux_functions)
            z.writestr("style.css", self.style)

    def load_aux_functions(self):
        aux_functions = []
        for name in self.aux_functions_name:
            aux_functions.append(read(name + " function.js", "js utils"))
        self.aux_functions = "\n\n".join(aux_functions)

    def get_html(self):
        html = read("main.html")
        style = f"<style>\n{self.style}\n</style>"
        self.load_aux_functions()
        js = (
            Template(self.chart_js)
            .safe_substitute(**self.__dict__)
            .replace("None", "null")
        )
        template = Template(html).safe_substitute(style=style, code=js)
        return Template(template).safe_substitute(data=self.dataset)

    def _repr_html_(self):
        html = urllib_quote(self.get_html())
        onload = (
            "this.contentDocument.open();"
            "this.contentDocument.write("
            "    decodeURIComponent(this.getAttribute('data-html'))"
            ");"
            "this.contentDocument.close();"
        )
        iframe = (
            f'<iframe src="about:blank" width="{self.width + 50}" height="{self.height + 50}"'
            'style="border:none !important;" '
            f'data-html={html} onload="{onload}" '
            '"allowfullscreen" "webkitallowfullscreen" "mozallowfullscreen">'
            "</iframe>"
        )
        return iframe


class ForceGraph(Base):
    def __init__(
        self,
        data,
        width,
        height,
        radio=20,
        tooltip=None,
        bounding_box=True,
        view_box=False,
        force_link=100,
        force_simulation=-50,
        force_collision=30,
        canvas=False,
    ):
        super().__init__(data, width, height, "force graph", view_box)
        if canvas and tooltip is not None:
            warnings.warn("Tooltip not available in canvas mode", stacklevel=2)

        self.tooltip = None if tooltip is None else tooltip
        self.radio = radio
        self.bounding_box = bool_js(bounding_box)
        self.force_link = force_link
        self.force_simulation = force_simulation
        self.force_collision = force_collision
        self.canvas = bool_js(canvas)

    def get_html(self):
        filename = "code-canvas.js" if self.canvas == bool_js(True) else "code-svg.js"
        code = read(filename, "force graph")
        html = super().get_html()
        return Template(html).safe_substitute(code=code)


class ArcDiagram(Base):
    def __init__(
        self,
        data,
        width,
        height=None,
        view_box=False,
        node_kws={},
        link_kws={},
        legend_kws={},
    ):
        if height is None:
            height = width / 2

        super().__init__(data, width, height, "arc diagram", view_box)
        self.node_kws = NodeCircleKws(node_kws, self.dataset)
        self.legend_kws = LegendHoverKws(legend_kws)
        self.link_kws = LinkLineKws(link_kws, self.dataset)
        self.aux_functions_name = ["color", "size"]


class RadialDiagram(Base):
    def __init__(self, data, size, tooltip=None, view_box=False):
        super().__init__(data, size, size, "radial diagram", view_box)
        self.tooltip = tooltip


class AdjacencyMatrix(Base):
    def __init__(self, data, size, view_box=False, bidirrectional=False, link_kws={}):
        super().__init__(data, size, size, "adjacency matrix", view_box)
        self.bidirrectional = bool_js(bidirrectional)
        self.link_kws = LinkRectKws(link_kws, self.dataset)
        self.aux_functions_name = ["color"]
