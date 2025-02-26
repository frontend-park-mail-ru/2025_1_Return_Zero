(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['playlists.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                <li class=\"item\">\n                    <img src=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"icon") : depth0), depth0))
    + "\" alt=\"\">\n                    <a href=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"href") : depth0), depth0))
    + "\" data-section=\""
    + alias2(((helper = (helper = lookupProperty(helpers,"key") || (data && lookupProperty(data,"key"))) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"key","hash":{},"data":data,"loc":{"start":{"line":13,"column":58},"end":{"line":13,"column":66}}}) : helper)))
    + "\">"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"text") : depth0), depth0))
    + "</a>\n                </li>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<header id=\"header\">\n    <a class=\"header__logo\">\n        <img class=\"logo\" src=\"/static/img/logo.png\" alt=\"logo\">\n    </a>\n    <form class=\"header__search\">\n        <input type=\"text\" id=\"search\" name=\"search\" placeholder=\"Поиск...\">\n    </form>\n    <nav class=\"header__nav\">\n        <ul>\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"navItems") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":10,"column":12},"end":{"line":15,"column":21}}})) != null ? stack1 : "")
    + "        </ul>\n    </nav>\n    <a class=\"header__profile\" href=\"\">\n        <img src=\"/static/img/no-avatar.svg\" alt=\"profile\">\n    </a>\n</header>";
},"useData":true});
})();