var resposta_secreta = document.getElementsByName("resposta_secreta")[0].value;
var resposta_secreta_hash = CryptoJS.SHA256(resposta_secreta).toString();

var resposta_secreta2 = document.getElementsByName("resposta_secreta2")[0].value;
var resposta_secreta_hash2 = CryptoJS.SHA256(resposta_secreta2).toString();
  
document.getElementsByName("resposta_secreta2")[0].value = resposta_secreta_hash;

function validarResposta() {
  var resposta_secreta = document.getElementsByName("resposta_secreta")[0].value;
  var resposta_secreta_hash = CryptoJS.SHA256(resposta_secreta).toString();

  if (resposta_secreta2.toUpperCase() != resposta_secreta.toUpperCase()) {
    document.getElementById("resposta-errada").style.display = "block";
    setTimeout(function() {
      document.getElementById("resposta-errada").style.display = "none";
    }, 2000); // tempo em milissegundos (2 segundos)
    return false;
  } else {
    return true;
  }
}

