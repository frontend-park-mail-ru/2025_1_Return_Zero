(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['Auth.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <input type=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"type") : depth0), depth0))
    + "\" placeholder=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"placeholder") : depth0), depth0))
    + "\" name=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"name") : depth0), depth0))
    + "\" required>\n    <p class=\"error-message\" name=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"errorName") : depth0), depth0))
    + "\"></p>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"inputs") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":4,"column":9}}})) != null ? stack1 : "")
    + "<input type=\"submit\" value=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"submitText") || (depth0 != null ? lookupProperty(depth0,"submitText") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"submitText","hash":{},"data":data,"loc":{"start":{"line":5,"column":28},"end":{"line":5,"column":42}}}) : helper)))
    + "\" class=\"submit-btn\">\n<p class=\"error-message\" name=\"global-error\"></p>";
},"useData":true});
})();