const http = require('http');
const fs = require('fs/promises');
const formidable = require('formidable');

http.ServerResponse.prototype.html = function(html) {
    this.writeHead(200, {'Content-Type': 'text/html'});
    this.write(html);
    return(this.end())
};

(async function() {
    let Hangman = await require('./hangman.js')();
    http.createServer(async function (req, res) {
        if('jpg' === req.url.split('.')[1]) {
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
            res.write(await fs.readFile(`.${req.url}`));
            return(res.end())
        } else {
            switch(req.url) {
                case '/play-hangman':
                    Hangman.Reset;
                    return(res.html(Hangman.Landing_Screen))
                case '/random-word':
                    try {
                        Hangman.Use_Random_Word;
                        return(res.html(Hangman.Play_Screen))
                    } catch(err) {
                        console.log(err);
                        return(res.html(Hangman.Landing_Screen))
                    };
                case '/custom-word':
                    form = new formidable.IncomingForm();
                    return(form.parse(req, function(err, fields) {
                        try {
                            Hangman.Use_Custom_Word = fields.custom_word[0];
                            if(Hangman.Acceptable_Word) {
                                return(res.html(Hangman.Play_Screen)) 
                            } else {
                                return(res.html(Hangman.Landing_Screen))
                            };
                        } catch(err) {
                            console.log(err);
                            return(res.html(Hangman.Landing_Screen))
                        };
                    }))
                case '/guess':
                    form = new formidable.IncomingForm();
                    return(form.parse(req, function(err, fields) {
                        try {
                            Hangman.Guess_Letter = fields.guess[0];
                            if(Hangman.Correct_Guesses < Hangman.True_Word.length && Hangman.Guesses_Left > 0) {
                                return(res.html(Hangman.Play_Screen))
                            } else if(Hangman.Correct_Guesses === Hangman.True_Word.length) {
                                return(res.html(Hangman.Winner_Screen))
                            } else if(Hangman.Guesses_Left === 0) {
                                return(res.html(Hangman.Loser_Screen))
                            };
                        } catch(err) {
                            console.log(err);
                            return(res.html(Hangman.Landing_Screen))
                        };
                    }))
            };
        };
    }).listen(8080);
})();