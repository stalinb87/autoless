watchit = require('watchit');
fs = require('fs');
less = require('less');


function toCSS(options, path, callback) {
  var tree, css;
  options = options || {};
  fs.readFile(path, 'utf8', function (e, str) {
    if (e) { return callback(e) }

      options.paths = [require('path').dirname(path)];
    options.filename = require('path').resolve(process.cwd(), path);
    options.optimization = options.optimization || 0;

    new(less.Parser)(options).parse(str, function (err, tree) {
      if (err) {
        callback(err);
      } else {
        try {
          css = tree.toCSS();
          callback(null, css);
        } catch (e) {
          callback(e);
        }
      }
    });
  });
}

function compila(archivo) {
  var destino = archivo.replace(/less/g, 'css');
  fs.readFile(archivo, function (err, cuerpo) {
    toCSS({}, archivo, function (err, resultado) {
      fs.writeFile(destino, resultado, function (err, final) {
        if (err) {
          console.error(err);
        } else {
          console.log("* Compile", archivo, "en", destino);
        }
      });
    });
  });
}

watchit('./assets/less/', {recurse: true, retain: true, include: true}, function (event, archivo) {
  if ((event == 'create' || event == 'change') && /.less$/.test(archivo)) {
    compila(archivo);
  }
})