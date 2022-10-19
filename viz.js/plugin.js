window.VizPlugin = window.VizPlugin || {
  id: "VizPlugin",
  init: function (deck) {
    var viz = new Viz();
    document
      .querySelectorAll(".reveal pre code.graph")
      .forEach(function (block) {
        var code = block.innerText;
        viz
          .renderSVGElement(code)
          .then(function (svg) {
            let pre = block.parentElement;
            pre.parentNode.replaceChild(svg, pre);
          })
          .catch((error) => {
            // Create a new Viz instance, errors cause it to be sad.
            viz = new Viz();
            console.error(error);
          });
      });
  },
};
