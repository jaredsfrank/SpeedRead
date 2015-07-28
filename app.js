$( document ).ready(function() {
    var text = ""
    var reader = new Start(text)
    function makeArray(string){
    	initWords = formatString(string).split(" ");
    	allWords = new Array(initWords.length);
    	for (word in initWords){
    		allWords[word]= new Word(initWords[word]);
    	}
    	return allWords;

    }

    function formatString(str){
    	result = str;
    	while(result.indexOf("-")>0||result.indexOf('—')>=0){
    		result = result.replace("-"," ");
            result = result.replace("—"," ");

    	}
        while(result.indexOf('\n')>=0){
            result = result.replace("\n"," ");
        }
    	return result;
    }

    function Word(word){
    	this.word = word
    	this.centerIndex = this.findFocus(word);
    	this.prefix = word.slice(0,this.centerIndex);
    	this.focus = word.charAt(this.centerIndex);
    	this.suffix = word.slice(this.centerIndex+1);

    }

    Word.prototype.findFocus = function(word){
    	length = word.length;
    	if(length==1) return 0;
    	else if(length<=5) return 1;
    	else if(length<=9) return 2;
    	else if(length<=13) return 3;
    	else return 4;
    }

    $('form').on('click', '#play',function(){
    	var wpm = $('#speed').val();
    	var interval = WPM(wpm);
        reader.resume();
        $('#play > use').attr('xlink:href','img/pause.svg#Layer_1');
        $('#play').attr('id','pause');

    	reader.setParams(text, interval);
    	reader.run();

    });

    $('#restart').click(function(){
        var wpm = $('#speed').val();
        var interval = WPM(wpm);
        $('#pause').attr('id','play')
        reader.reset();
        reader.setParams(text, interval);
    });

    $('form').on('click', '#pause',function(){
        reader.pause();
        $('#pause > use').attr('xlink:href','img/play.svg#Layer_1');
        $('#pause').attr('id','play')

    });

    $('#submit').click(function(){
        text = $('.input').val();
        var wpm = $('#speed').val();
        var interval = WPM(wpm);
        reader.setParams(text, interval);
    });


    function Start(str, interval){
        this.count = 0;
    	this.interval = interval||240;
    	this.startTime = null;
    	this.delay = Infinity;
        if(str) this.allWords = makeArray(str).slice()||[];
        else this.allWords = [];
    }

    Start.prototype.setParams = function(str,interval){
        this.interval = interval;
        this.allWords = makeArray(str).slice();

    }
    Start.prototype.reset = function(){
    	this.count = 0;
        this.allWords = [];
    }
    Start.prototype.pause = function(){
        this.delay = Infinity;
    }
    Start.prototype.resume = function(){
        var that = this;
        $('.grayFill').css("width","200px").animate({width:'0px'},'slow', function(){
            that.delay=0;
        });
    }
    Start.prototype.run = function(){
    	window.requestAnimationFrame(this.updateWord.bind(this));
    	this.startTime = (new Date()).getTime();


    }

    Start.prototype.updateWord = function(){
    	var timeStamp = (new Date()).getTime();
    	var timeDif = timeStamp-this.startTime;
    	if(timeDif>(this.interval)+this.delay){

	   		if(this.allWords[this.count].word.indexOf(".")>0){
	   			this.delay = this.interval*2;
	   		}
            else if(this.count<3){
	   			this.delay = 600/(this.count+1);
	   		}
	   		else if(this.allWords[this.count].word.length>8){
	   			this.delay = this.interval*.5;
	   		}
            else if(this.allWords[this.count].word.indexOf(":")>0){
                this.delay = this.interval;
            }
	   		else{
	   			this.delay = 0;
	   		}
	    	var currentWord = this.allWords[this.count];
	    	$(".prefix").text(currentWord.prefix);
	    	$(".focus").text(currentWord.focus);
	    	$(".suffix").text(currentWord.suffix);
	    	this.startTime = timeStamp;
	   		this.count++;
	    }
    	if (this.count<allWords.length){
			window.requestAnimationFrame(this.updateWord.bind(this));
    	}

    }

    function WPM(wpm){
    	return 60000/wpm;
    }

});