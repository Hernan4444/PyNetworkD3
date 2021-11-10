"""Core module for the package. It holds the main object to be used."""

from os.path import join
from string import Template
from urllib.parse import quote as urllib_quote

from .constants import TEMPLATE_PATH


class Base:
    def __init__(self, data, width, height, chart):
        self.data = data
        self.__size = {"width": width, "height": height}
        with open(join(TEMPLATE_PATH, chart, f"{chart}.js"), encoding="utf-8") as file:
            self.chart_js = file.read()

        with open(join(TEMPLATE_PATH, chart, f"{chart}.css"), encoding="utf-8") as file:
            self.style_css = "<style>\n{}\n</style>".format(file.read())

    def export(self, path):
        with open(path, "w", encoding="utf-8") as file:
            file.write(self.get_html())

    def get_html(self):
        with open(join(TEMPLATE_PATH, "main.html"), encoding="utf-8") as file:
            html = file.read()

        style_css = self.style_css
        chart_js = Template(self.chart_js).safe_substitute(
            data=self.data, **self.__size
        )
        return Template(html).safe_substitute(style=style_css, code=chart_js)

    @property
    def width(self):
        return self.__size["width"]

    @width.setter
    def width(self, value):
        self.__size["width"] = value

    @property
    def height(self):
        return self.__size["height"]

    @height.setter
    def height(self, value):
        self.__size["height"] = value

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
            '<iframe src="about:blank" width="{width}" height="{height}"'
            'style="border:none !important;" '
            'data-html={html} onload="{onload}" '
            '"allowfullscreen" "webkitallowfullscreen" "mozallowfullscreen">'
            "</iframe>"
        ).format(
            html=html, onload=onload, width=self.width + 50, height=self.height + 50
        )
        return iframe


class Graph(Base):
    def __init__(self, data, width, height, radio=20, tooltip="null"):
        super().__init__(data, width, height, "graph")
        self.__attributes = {"tooltip": tooltip, "radio": radio}

    def get_html(self):
        html = super().get_html()
        return Template(html).safe_substitute(**self.__attributes)

    @property
    def radio(self):
        return self.__attributes["radio"]

    @radio.setter
    def radio(self, value):
        self.__attributes["radio"] = value


class ArcDiagram(Base):
    def __init__(self, data, width, height, radio=20, tooltip="null"):
        super().__init__(data, width, height, "arc diagram")
        self.__attributes = {"tooltip": tooltip, "radio": radio}

    def get_html(self):
        html = super().get_html()
        return Template(html).safe_substitute(**self.__attributes)

    @property
    def radio(self):
        return self.__attributes["radio"]

    @radio.setter
    def radio(self, value):
        self.__attributes["radio"] = value
