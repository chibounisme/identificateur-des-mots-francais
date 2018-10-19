const yargs = require('yargs')
const request = require('request')

const API_KEY = "dict.1.1.20181018T105620Z.958bec8bbe90e6cf.1dd8fab21d36bc0a3a8cebc248e08ca91e0153b4";

let url = `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${API_KEY}&lang=fr-en&text=`

let argv = yargs
    .alias('t', 'type')
    .describe('t', 'Afficher le type d\'un mot spécifié en argument')
    .alias('g', 'genre')
    .describe('g', 'Afficher le genre d\'un mot spécifié en argument')
    .alias('w', 'word')
    .describe('w', 'Le mot à traiter')
    .nargs('w', 1)
    .demandOption(['w'])
    .help()
    .strict()
    .showHelpOnFail(false, "Specifier --help pour les options disponibles")
    .argv

if (!(argv.t || argv.g)) {
    console.log('Vous devez spécifier une option:\n1- -t ou --type\n2- -g ou -genre')
} else {
    url += argv.w
    request({
        url,
        json: true
    }, (err, res, body) => {
        if (err)
            console.log(err)
        else {
            if (!body.def.length)
                console.log(`Le mot ${argv.w} n'existe pas dans le dictionnaire!`)
            else {
                console.log(`Mot: ${argv.w}`)
                let type;
                switch (body.def[0].pos) {
                    case 'adverb':
                        type = 'adverbe'
                        break
                    case 'noun':
                        type = 'nom'
                        break
                    case 'adjective':
                        type = 'adjectif'
                        break
                    case 'determiner':
                        type = 'determinant'
                        break
                    default:
                        type = body.def[0].pos
                        break
                }
                if (argv.t)
                    console.log(`Type: ${type}`)
                if (argv.g) {
                    if (type === 'nom') {
                        let genre = body.def[0].gen === 'm' ? 'masculin' : 'féminin'
                        console.log(`Genre: ${genre}`)
                    }
                    else
                        console.log("Pas de genre puisque le mot n'est pas un nom!")
                }
            }
        }
    })
}
