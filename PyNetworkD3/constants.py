"""This module holds every constant for the library."""
from os.path import dirname, join

TEMPLATE_PATH = join(dirname(__file__), "templates")

CATEGORICAL_SCHEMES = ["Category10", "Accent", "Dark2", "Paired", "Pastel1", "Pastel2",
                       "Set1", "Set2", "Set3", "Tableau10"]

ORDERED_SCHEMES = ["Blues", "Greens", "Greys", "Oranges", "Purples", "Reds",
                   "BuGn", "BuPu", "GnBu", "OrRd", "PuBuGn", "PuBu", "PuRd", "RdPu", "YlGnBu",
                   "YlGn", "YlOrBr", "YlOrRd", "Cividis", "Viridis", "Inferno", "Magma", "Plasma",
                   "Warm", "Cool", "CubehelixDefault", "Turbo", "BrBG", "PRGn", "PiYG", "PuOr",
                   "RdBu", "RdGy", "RdYlBu", "RdYlGn", "Spectral", "Rainbow", "Sinebow"]
