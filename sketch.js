let mobilenet;
let classifier;
let video;
let results;
let sadClicks = 0;
let happyClicks = 0;

let body = document.getElementsByTagName('body')[0];
let rainAudio = document.getElementById("rain");
let cricketAudio = document.getElementById("crickets");
let buttonAudio = document.getElementById("buttonAudio");

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
        sadClicks += 1;
        document.getElementById('sad').innerHTML = " <i class=\"fas fa-sad-tear\"></i>" + "Sad images trained: " + sadClicks;
        classifier.addImage('sad');
    };
    document.getElementById('happy').onclick = function() {
        happyClicks += 1;
        document.getElementById('happy').innerHTML = " <i class=\"fas fa-smile\"></i>" + "Happy images trained: " + happyClicks;
        classifier.addImage('happy');
    };
    document.getElementById('train').onclick = function() {
        buttonAudio.play();
        document.getElementById('sad').innerHTML = " <i class=\"fas fa-sad-tear\"></i>" + "Sad";
        document.getElementById('happy').innerHTML = " <i class=\"fas fa-smile\"></i>" + "Happy";
        happyClicks = 0;
        sadClicks = 0;
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


