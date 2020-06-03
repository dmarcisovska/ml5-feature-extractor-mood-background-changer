let mobilenet;
let classifier;
let video;
let results;

let body = document.getElementsByTagName('body')[0];
let rainAudio = document.getElementById("rain");
let cricketAudio = document.getElementById("crickets");

function modelReady() {
    console.log('Model is ready!!!');
}

function videoReady() {
    console.log('Video is ready!!!');
}

function whileTraining(loss) {
    if (loss == null) {
        console.log('Training Complete');
        classifier.classify(gotResults);
    } else {
        console.log(loss);
    }
}

function gotResults(error, result) {
    if (error) {
        console.error(error);
    } else {
        results = result[0].label;
        classifier.classify(gotResults);

        if (results === "sad"){
            document.body.style.backgroundImage = "url('assets/sad.jpg')";
            body.setAttribute('class', 'weather rain');
            cricketAudio.pause();
            rainAudio.play();
        }

        if (results === "happy"){
            if (document.getElementsByClassName('weather').length) {
                body.classList.remove("weather");
                body.classList.remove("rain");
            }
            document.body.style.backgroundImage = "url('assets/happy.jpg')";
            rainAudio.pause();
            cricketAudio.play();
        }

    }
}

function setup() {

    createCanvas(340, 270);
    video = createCapture(VIDEO);
    video.hide();
    background(0);
    mobilenet = ml5.featureExtractor('MobileNet', modelReady);
    classifier = mobilenet.classification(video, videoReady);

    document.getElementById('sad').onclick = function () {
        classifier.addImage('sad');
    };
    document.getElementById('happy').onclick = function() {
        classifier.addImage('happy');
    };
    document.getElementById('train').onclick = function() {
        classifier.train(whileTraining);
    };
}

function draw() {
    push();
    translate(width,0);
    scale(-1, 1);
    image(video, 0, 0, 340, 270);
    pop();
}


