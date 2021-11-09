"""Core module for the package. It holds the main object to be used."""

from os.path import join
from string import Template

from .constants import TEMPLATE_PATH


class Base:
    def __init__(self, data, width, height, chart):
        self.data = data
        self.__size = {"width": width, "height": height}
        with open(join(TEMPLATE_PATH, chart, f"{chart}.js"), encoding="utf-8") as file:
            self.chart_js = file.read().replace("\n", "\n\t\t")

        with open(join(TEMPLATE_PATH, chart, f"{chart}.css"), encoding="utf-8") as file:
            self.style_css = "<style>\n\t\t{}\n\t</style>".format(
                file.read().replace("\n", "\n\t")
            )

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
