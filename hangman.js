async function Hangman() {
    const fs = require('fs/promises');
    let dictionary_txt = await fs.readFile('./dictionary.txt', 'utf8');
    return({
		Used_Letters: [],
        Dictionary: dictionary_txt.split(','),
        get Use_Random_Word() {
            let random_word = this.Dictionary[Math.round(Math.random() * this.Dictionary.length)];
            this.Whole_Word = random_word;
        },
        set Use_Custom_Word(value) {
            Custom_Word = value.toLowerCase();
            if(this.Dictionary.includes(Custom_Word)) {
                this.Whole_Word = Custom_Word;
                this.Acceptable_Word = true;
            } else {
                this.Acceptable_Word = false;
            };
        },
        Landing_Screen: `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Hangman</title></head><body><h1>Hangman</h1><hr /><h2>Please, choose from using a random word or a custom word. All words are matched against a list of 370105 English words and only they are accepted.</h2><form action="/random-word" method="post"><input type="submit" value="Random Word" /></form><form action="/custom-word" method="post"><input type="password" name="custom_word" /><input type="submit" value="Custom Word" required /></form></body></html>`,
        get Play_Screen() {
            return(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Hangman</title></head><body><h1>Hangman</h1><hr /><h2>${this.Show_Word.join(' ')}</h2><img src="./${this.Incorrect_Guesses}.jpg" width="25%" /><hr /><form action="/guess" method="post"><p>You have guessed ${this.Total_Guesses}! ${this.Correct_Guesses} were correct. You have ${this.Guesses_Left} guesses left.</p><label for="guess">Guess a letter:</label><input type="text" id="guess" name="guess" maxlength="1" autofocus required /><input type="submit" value="Guess" /></form></body></html>`)
        },
        get Winner_Screen() {
            return(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Hangman</title></head><body><h1>Hangman</h1><hr /><h2>Not today! You survived!</h2><h3>The correct word was "${this.True_Word}"</h3><h3>The word was ${this.True_Word.length} long and you used ${this.Total_Guesses} guesses.</h3><form action="/play-hangman" method="post"><input type="submit" value="Play Again" /></form></body></html>`)
        },
        get Loser_Screen() {
            return(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Hangman</title></head><body><h1>Hangman</h1><hr /><h2>Oh, snap! Suicide!</h2><img src="./4.jpg" width="25%" /><h3>The correct word was "${this.True_Word}"</h3><h3>The word was ${this.True_Word.length} long and you used all your guesses.</h3><form action="/play-hangman" method="post"><input type="submit" value="Play Again" /></form></body></html>`)
        },
        set Whole_Word(value) {
            this.True_Word = value.toLowerCase();
            this.Split_Word = this.True_Word.split('');
            this.Show_Word = [...this.True_Word.replace(/\w/g, '_')];
            console.log(this.True_Word);
        },
        Total_Guesses: 0,
        Correct_Guesses: 0,
        Incorrect_Guesses: 0,
        get Guesses_Left() {
            return(4 - this.Incorrect_Guesses)
        },
        get Reset() {
            console.log('Reset');
            this.Total_Guesses = 0;
            this.Correct_Guesses = 0;
            this.Incorrect_Guesses = 0;
			this.Used_Letters = [];
        },
        set Guess_Letter(value) {
			if(this.Used_Letters.includes(value.toLowerCase())) {
				return;
			} else {
				this.Used_Letters.push(value.toLowerCase());
	            let found = 0;
    	        for(let i = 0; i < this.Split_Word.length; i++) {
        	        if(this.Split_Word[i] === value.toLowerCase()) {
            	        this.Split_Word[i] = '_';
                	    this.Show_Word[i] = value.toLowerCase();
                    	found++;
	                };
    	        };
        	    if(found) {
            	    this.Correct_Guesses += found;
            	} else{
                	this.Incorrect_Guesses++;
            	};
            	this.Total_Guesses++;
			};
        }
    })
};

module.exports = Hangman;