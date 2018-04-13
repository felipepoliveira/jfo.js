var JFO = require("./jfo.js");
let jfoFilter = JFO({
    require : [
        "endereco"
    ],

});

let data = [
    {
        nome : "Felipe",
        sobrenome : "Pereira de Oliveira",
        dataNascimento : 0,
        endereco : {
            rua : "R. das Flores",
            bairro : "Guaianases"
        }
    },
    
    {
        nome : "Guilherme",
        sobrenome : "Duarte",
        dataNascimento : 1,
        endereco : {
            rua : "R. de Piritubacity",
            bairro : "Pirituba"
        }
    },
];
let filteredData = jfoFilter.filter(data);

console.log(filteredData);