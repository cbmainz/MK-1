
function preload() {
	keyList = [LEFT_ARROW, UP_ARROW, DOWN_ARROW, RIGHT_ARROW, ' ', 'W', 'A', 'S', 'D', 'F', 'G'];

	pitchPresets = [
		{name:'Dur (hoch)', pitches:[60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77]},
		{name:'Dur (tief)', pitches:[48, 50, 52, 53, 55, 57, 59, 60, 62, 64, 65]},
		{name:'Moll Pentatonik', pitches:[48, 51, 53, 55, 58, 60, 63, 65, 67, 70, 72]},
		{name:'Dur Pentatonik', pitches:[48, 50, 52, 55, 57, 60, 62, 64, 67, 69, 72]},
		{name:'Ganztonschritte', pitches:[48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68]},
		{name:'Durdreiklang', pitches:[48, 52, 55, 60, 64, 67, 72, 76, 79, 83, 84]},
		//{name:'Zufall', pitches:[60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77]},
	];
	
	majorScale = [60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77];
	
	samplePresets = [
		{name:'Klavier', filename:'piano_C3'},
		{name:'Vibraphon', filename:'vibraphone'},
		{name:'Pfeifen', filename:'whistle'},
		//{name:'Furz', filename:'splurt'},
		{name:'Ooh', filename:'ooh'},
		//{name:'mouth rhythm', filename:'mouth-rhythm'}, 
		{name:'Bass', filename:'acoustic-bass'}, 
		{name:'Kalimba', filename:'kalimba'}, 
	];
	
	keySymbols = ['\u2190', '\u2191','\u2193','\u2192','\u2423'];
	noteNames = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
	keyColors = ['white', 'black', 'white', 'black', 'white', 'white', 'black', 'white', 'black',
		'white', 'black', 'white'];
	
	samplePresetAudio = [];
	for (var i=0; i<samplePresets.length; i++) {
		samplePresetAudio[i] = loadSound('sounds/' + samplePresets[i].filename + '.wav');
	}
	
	audioSamples = [];
	audioSamples[0] = loadSound('sounds/piano_C3.wav');

	numPeaks = 390;	
	
	mouseIsPressedOnPianoKeyNum = -1;
	
	container = createElement('div');
	container.addClass('container');
	
	outlineDiv = createElement('div');
	outlineDiv.addClass('outlineBox');
	outlineDiv.parent(container);
	outlineDiv.mousePressed(hideHelpBoxes);
	
	titlesDiv = createElement('div');
	titlesDiv.addClass('titles');
	titlesDiv.parent(outlineDiv);
	
	titleDiv = createElement('div');
	titleDiv.addClass('title');
	titleDiv.parent(titlesDiv);
	titleDiv.html('MK-1');
	
	subtitleDiv = createElement('div');
	subtitleDiv.addClass('subtitle');
	subtitleDiv.parent(titlesDiv);
	subtitleDiv.html('Sampling Keyboard f\u00FCr Makey Makey');

	logoLink = createElement('a');
	logoLink.attribute('href', 'http://makeymakey.com');
	logoLink.attribute('target', '_blank');
	logoLink.parent(outlineDiv);
	logo = createImg('images/makey-makey-logo.svg');
	logo.parent(logoLink);
	logo.addClass('mm-logo');
	
	logoLink = createElement('a');
	logoLink.attribute('href', 'http://medienundbildung.com');
	logoLink.attribute('target', '_blank');
	logoLink.parent(outlineDiv);
	logo = createImg('images/m+b-logo.svg');
	logo.parent(logoLink);
	logo.addClass('mb-logo');

	controlsDiv = createElement('div');
	controlsDiv.addClass('controls');
	controlsDiv.parent(outlineDiv);
	    
    recControls = createElement('div');
    recControls.parent(controlsDiv);
    recControls.addClass('recControls');
    
    recBtn = createElement('div');
    recBtn.parent(recControls);
    recBtn.addClass('circleButton');
    recBtn.mousePressed(startRecording);
    
    recBtnLabel = createElement('div');
    recBtnLabel.parent(recBtn);
    recBtnLabel.html('REC');
    recBtnLabel.addClass('buttonLabel');
    
    recStatus = createElement('div');
    recStatus.parent(recControls);
    recStatus.addClass('recStatus');
    
    recordingNow = false;
    recStartTime = 0;
    
    waveFormDiv = createElement('div');
    waveFormDiv.addClass('waveForm');
    waveFormDiv.parent(controlsDiv);
    
    waveformInstructionLabel = createElement('div');
    waveformInstructionLabel.parent(waveFormDiv);
    waveformInstructionLabel.html('Klicke in das Feld, um die Startzeit zu ver\u00e4nden.');
    waveformInstructionLabel.addClass('notification');
    waveformInstructionLabel.style('visibility', 'hidden'); 
    
	helpBoxes = createHelpBoxes();
	helpBoxesShowing = false;
	
	helpBtn = createElement('div');
    helpBtn.parent(container);
    helpBtn.addClass('circleButton');
    helpBtn.addClass('helpButton');
    helpBtn.mousePressed(toggleHelpBoxes);
    
    helpBtnLabel = createElement('div');
    helpBtnLabel.parent(helpBtn);
    helpBtnLabel.html('?');
    helpBtnLabel.addClass('buttonLabel');
    helpBtnLabel.addClass('helpButtonLabel');
    
	canvas = createCanvas(numPeaks, 150);
	canvas.parent(waveFormDiv);
	canvas.mousePressed(setStartTimeClick);
	
	createPresetButtons('Tonart', pitchPresets, setKeyPreset);
	createPresetButtons('Samples', samplePresets, loadSamplePreset);
    
	createPianoElements();

	createKeyObjects(pitchPresets[0].pitches);
	setPianoLabels();
	createPlayHeads();

	initSampler();
	
	credits = createElement('div');
	credits.addClass('credits');
	credits.parent(container);
	creditsHTML = "Entwicklung <a href=https://www.ericrosenbaum.com/mk1-sampler/ target=_blank>Eric Rosenbaum</a> | \u00dcbersetzung <a href=https://github.com/cbmainz/MK-1 target=_blank>cbmainz</a> | cc by <a href=http://medienundbildung.com target=_blank>medien+bildung.com</a><br>";
	credits.html(creditsHTML);
}

// create empty soundFiles objects that will be filled with a buffer later
function initSampler() {
	for (var i=1; i<keyObjects.length; i++) {
		audioSamples[i] = new p5.SoundFile();
	}
}


function createPresetButtons(headingTitle, presetList, pressFunction) {
    presetsBox = createElement('div');
    presetsBox.addClass('presetsBox');
    presetsBox.parent(controlsDiv);

	title = createElement('div');
	title.addClass('presetTitle');
	title.html(headingTitle);
	title.parent(presetsBox);

	btns = [];
	groupName = headingTitle;
	for (var i=0; i<presetList.length; i++) {
		btns[i] = createPresetButton(presetList[i].name, i, groupName, pressFunction);
	}
	
	btns[0].attribute('checked','');

}

function createPresetButton(name, index, group, pressFunction) {
	presetButtonContainer = createElement('div');
	presetButtonContainer.addClass('presetButton');
	presetButtonContainer.parent(presetsBox);
	
	presetButton = createElement('input');
	presetButton.attribute('type', 'radio');
	presetButton.attribute('name', group);
	presetButton.attribute('id', name);
	presetButton.parent(presetButtonContainer);
	
	presetButtonLabel = createElement('label');
	presetButtonLabel.attribute('for', name);
	presetButtonLabel.html(name);
	presetButtonLabel.mousePressed(pressFunction.bind(null, index));
	presetButtonLabel.parent(presetButtonContainer);
	
	return(presetButton);
}


function setKeyPreset(index) {
	if (pitchPresets[index].name === "randomize!") {
		randomPitches = [];
		allPitches = majorScale.slice();
		for (var i=0; i<keyList.length; i++) {
			index = Math.round(random(0,allPitches.length-1));
			newPitch = allPitches[index];
			allPitches.splice(index,1);
			randomPitches.push(newPitch);
		}
		createKeyObjects(randomPitches);
	} else {
		createKeyObjects(pitchPresets[index].pitches);
	}

	setPianoLabels();
}

function loadSamplePreset(index) {
	audioSamples[0] = samplePresetAudio[index];
	analyzeNewSample();
}

function createKeyObjects(pitches){
	keyObjects = [];
	numKeyObjects = keyList.length;
	for (var i = 0; i<numKeyObjects; i++) {
		keyObjects[i] = new Object();
		keyObjects[i].keyName = keyList[i];
  		keyObjects[i].pitch = pitches[i];
  		keyObjects[i].rate = ratioForPitch(keyObjects[i].pitch);
  		keyObjects[i].noteName = noteNames[keyObjects[i].pitch % noteNames.length];
  		  		
  		keyObjects[i].isPressed = false;

  		if (i<5) {
	  		keyObjects[i].keySymbol = keySymbols[i];
	  	} else {
	  		keyObjects[i].keySymbol = keyList[i];
	  	}
	  	
	  	keyObjects[i].pianoKeyNum = keyObjects[i].pitch - 48;
	  	
		hue = (i / numKeyObjects) * 255; 
		colorMode(HSB, 255);
		c = color(hue, 100, 200);
		keyObjects[i].color = c;
  	}
}

function createPlayHeads() {
	playHeads = [];	
	for (var i=0; i<keyObjects.length; i++) {
		playHeads[i] = createElement('div');
		playHeads[i].addClass('playHead');
		c = keyObjects[i].color;
		playHeads[i].style('background',c.toString());
		playHeads[i].parent(waveFormDiv);
	}
}

function createPianoElements() {

	pianoDiv = createElement('div');
	pianoDiv.parent(outlineDiv);

  	pianoElt = createElement('ul');
  	pianoElt.class('piano');
  	pianoElt.parent(pianoDiv);

  	pianoKeyElts = [];
  	for (var i=0; i<37; i++) {
  		pianoKeyElts[i] = createElement('li');
  		pianoKeyElts[i].parent(pianoElt);
  		c = keyColors[i%(keyColors.length)];
	  	pianoKeyElts[i].class(c);
	  	pianoKeyElts[i].attribute('color', c);
  		pianoKeyElts[i].attribute("num", i);
  		
  		pianoKeyElts[i].mousePressed(pianoKeyEltPressed.bind(this,i)); 
  		pianoKeyElts[i].mouseReleased(pianoKeyEltReleased.bind(this,i));  		
 		// using mouseOut is a hack because we have no releaseOutside function
  		pianoKeyElts[i].mouseOut(pianoKeyEltReleased.bind(this,i));  		
  	}  	
}

function pianoKeyEltPressed(num) {
	mouseIsPressedOnPianoKeyNum = num;
	startNote(0, num+48);
	setPianoKeyState(num, true, keyObjects[0].color.toString());
}
function pianoKeyEltReleased(num) {
	mouseIsPressedOnPianoKeyNum = -1;
	decayTime = 0.5;
	audioSamples[0].setVolume(0, decayTime);
	audioSamples[0].stop(decayTime);
	setPianoKeyState(num, false, '');
}

function setPianoLabels() {
	
	labels = selectAll('.keyLabel');
	for (var i=0; i<labels.length; i++) {
		labels[i].remove();
	}
	
	for (var i=0; i<keyObjects.length; i++) {
		label = createElement('div');
		label.html(keyObjects[i].keySymbol);
		keyNum = keyObjects[i].pianoKeyNum;
		label.parent(pianoKeyElts[keyNum]);
		label.addClass('keyLabel');
		if (pianoKeyElts[keyNum].attribute('color') == 'black') {
			label.addClass('blackKeyLabel');
		}
	}
}

function setup() {
	mic = new p5.AudioIn();
	recorder = new p5.SoundRecorder();
    recorder.setInput(mic);
    recordingDuration = 2;
	
  	setStartTimeAt(0);

  	waveBox = {x:0, y:0, w:numPeaks, h:150 };
	analyzeNewSample();
	
	showHelpBoxes();
}

function startNote(num, pitch) {
	// audioSamples[num].loop(0, ratioForPitch(pitch), 1.0, startTimeSec, recordingDuration);
	audioSamples[num].loop(0, 1.0, 1.0, startTimeSec, recordingDuration);
	audioSamples[num].rate(ratioForPitch(pitch));
	audioSamples[num].setVolume(1, 0.0001);
	playHeads[num].startTime = millis() / 1000;
}

function draw() {

	for (var i=0; i<playHeads.length; i++) {
		// this is a horrible hack because the p5 audio does not report the correct
		// times. this sort of works, but it drifts after a few loops
		if (audioSamples[i].isPlaying()) {
			timeSinceStart = (millis() / 1000) - playHeads[i].startTime;
			scaledDuration = (audioSamples[i].duration() - startTimeSec) / keyObjects[i].rate;
			position = (timeSinceStart % scaledDuration) * keyObjects[i].rate;
			normalizedPosition = position / audioSamples[i].duration();
			xPos = (normalizedPosition * numPeaks) + startTimePx;
			playHeads[i].style('left', xPos.toString());
			playHeads[i].style('visibility', 'visible');
			// level = audioSamples[i].getLevel(0.5);
			// level = map(level,0,1,1,20);
			// playHeads[i].style('width',level.toString());
		} else {
			playHeads[i].style('left', '0');
			playHeads[i].style('visibility', 'hidden');
		}
	}

	if (recordingNow) {
		partDone =  (millis() - recStartTime) / (recordingDuration * 1000);
		barLength = partDone * numPeaks;
		level = mic.getLevel(.5);

		colorMode(HSB, 100);
		hue = level *1000;
		hue = constrain(hue, 0,100);
		hue = map(hue,0,100,0,20);
		fill(hue,100,80);
		noStroke();

		// need to set width of each rect using calculated times?
		//rect(0,0,barLength,waveBox.h);
		barHeight = map(level, 0, 1, 1, waveBox.h);
		rect(barLength-5, waveBox.h/2-barHeight, 8, barHeight*2);
	}
	
	if (mic.enabled) {
		recStatus.style('visibility', 'hidden');
	} else {
		recStatus.style('visibility', 'visible');
	}
}

function drawWaveForm() {	
	fill(255);
	noStroke();
	rect(waveBox.x, waveBox.y, waveBox.w, waveBox.h);
    
    var middle = waveBox.y + waveBox.h/2;
    
    stroke(0);
    for (var i=0; i<numPeaks; i++) {
		val = peaks[i] * waveBox.h/2;
		
		colorMode(HSB, 100);
		hue = peaks[i] * 20;
		stroke(hue,100,80);

		line(waveBox.x + i, middle + val, waveBox.x +  i, middle - val);
	}
	
	//stroke(255,0,0);
	//line(waveBox.x + startTimePx, waveBox.y, waveBox.x + startTimePx, waveBox.y + waveBox.h);	
	colorMode(RGB,255);
	fill(100,100,100,50);
	noStroke();
	rect(waveBox.x, waveBox.y, startTimePx, waveBox.h);	
}

function setStartTimeClick() {
	if(hitTest(waveBox)) {
		setStartTimeAt(mouseX - waveBox.x);
		drawWaveForm();
	}
}

function setStartTimeAt(px) {
	startTimePx = px;
	startTimeSec = (startTimePx / numPeaks) * recordingDuration;
}

function startRecording() {
		if (!mic.enabled) {
			mic.start();
			recStatus.html('Das Mikrofon braucht noch deine Erlaubnis');
			return;
		}
		
		if (!recordingNow) {
  		 	recorder.record(audioSamples[0], recordingDuration, finishedRecording);
		    recordingNow = true;
		    recStartTime = millis();
		    recBtn.addClass('recording');
		    
		    // blank out the waveform box
		    fill(255);
			noStroke();
			rect(waveBox.x, waveBox.y, waveBox.w, waveBox.h);
	  	}
}

function finishedRecording() {
	analyzeNewSample();
	recordingNow = false;
	recBtn.removeClass('recording');

	waveformInstructionLabel.style('visibility', 'visible');
}

function analyzeNewSample() {
	peaks = audioSamples[0].getPeaks(numPeaks);
	
	for (var i=1; i<keyObjects.length; i++) {
		audioSamples[i].buffer = audioSamples[0].buffer;
	}
	
	setStartTimeAt(0);

	mean = 0;
	sum = 0;
	for (var i=0; i<peaks.length; i++) {
		sum += peaks[i];
	}
	mean = sum / peaks.length;
		
	for (var i=0; i<peaks.length; i++) {
		if (peaks[i] > (mean)) {
			loc = (i / peaks.length) * waveBox.w;
			setStartTimeAt(loc);
			break;
		}
	}
		
	drawWaveForm();
}

function hitTest(rect) {
	if (mouseX > rect.x && mouseX < rect.x + rect.w) {
		if (mouseY > rect.y && mouseY < rect.y + rect.h) {
			return true;
		}
	}
	return false;
}

function ratioForPitch(num) {
	return (midiToFreq(num) / midiToFreq(60));
}

function keyPressed(ev) {

	hideHelpBoxes();

	for (var i = 0; i < numKeyObjects; i++) {
		if (key == keyObjects[i].keyName || keyCode == keyObjects[i].keyName) {
			ev.preventDefault();
			if (!keyObjects[i].isPressed) {
  				startNote(i, keyObjects[i].pitch);
  				keyObjects[i].isPressed = true;
 				pianoKeyNum = keyObjects[i].pianoKeyNum;
 				setPianoKeyState(pianoKeyNum, true, keyObjects[i].color.toString());
  			}
		}
	}
	
	// remapping
	if (mouseIsPressedOnPianoKeyNum != -1) {
		for (var i = 0; i < numKeyObjects; i++) {
			if (key == keyObjects[i].keyName || keyCode == keyObjects[i].keyName) {
				setPianoKeyState(keyObjects[i].pianoKeyNum, false);
				keyObjects[i].pianoKeyNum = mouseIsPressedOnPianoKeyNum;
				setPianoLabels();
				keyObjects[i].pitch = mouseIsPressedOnPianoKeyNum + 48;
		  		keyObjects[i].rate = ratioForPitch(keyObjects[i].pitch);
  				keyObjects[i].noteName = noteNames[keyObjects[i].pitch % noteNames.length];

			}
		}
	}
	
}

function keyReleased() {
	for (var i = 0; i < keyObjects.length; i++) {
		if (key == keyObjects[i].keyName || keyCode == keyObjects[i].keyName) {
			decayTime = 0.2 / keyObjects[i].rate;
			audioSamples[i].setVolume(0, decayTime);
			audioSamples[i].stop(decayTime);
			keyObjects[i].isPressed = false;
			setPianoKeyState(keyObjects[i].pianoKeyNum, false, '');
		}
	}
	
	// save your audio sample as a wav file!
	if (key == 'Z') {
		filename = "sample" + millis() + ".wav";
		saveSound(audioSamples[0], filename);
	}
}

function setPianoKeyState(num, state, color) {
	if (state) {
		pianoKeyElts[num].style('background', color);
	} else {
	  	c = pianoKeyElts[num].attribute('color');
		if (c == 'black') {
			pianoKeyElts[num].style('background', '#000000');
		} else {
			pianoKeyElts[num].style('background', '#ffffff');
		}
	}
}

function createHelpBoxes() {    
	boxes = [];

	b = createHelpBox(62, -190, 
		'Samples aufnehmen',
		'Das Mikrofon braucht die Erlaubnis, um deine eigenen Samples aufzunehmen. ' + 
    	'Sag etwas, mache Krach, spiele ein Instrument oder mach einfach brrrrrrr.');
	boxes.push(b);  
	
	b = createHelpBox(250, -190, 
		'Spiele auf der Tastatur', 
		'Benutze Makey Makey, deine Computertastatur oder klick auf die Tasten');
	boxes.push(b);  
	
	b = createHelpBox(110, 300, 
		'Spiele andere T\u00f6ne', 
		'W\u00e4hle hier eine andere Tonart.');
	boxes.push(b);  
	
	b = createHelpBox(110, 770, 
		'Versuche andere Kl\u00e4nge', 
		'W\u00e4hle hier ein anderes Sampel.',
		true);
	boxes.push(b);  

	b = createHelpBox(250, 770, 
		'Belege die Tastatur selbst', 
		'Klicke und halte die Maus auf einer Klaviertaste und dr\u00fccke eine Taste auf der Computertastatur. ' +
		'Zum Beispiel, klicke und halte die Taste ganz rechts auf dem Klavier und dr\u00fccke \u2191. ' +
		'Wenn du nun wieder \u2191 dr\u00fcckst, wird die hohe Note gespielt.', 
		true);
	boxes.push(b);  

	return boxes;     
}

function createHelpBox(top, left, heading, body, flip) {
    box = createElement('div');
    box.addClass('arrow_box');    
    box.parent(container);
    box.style('top:'+ top + 'px; left:' + left + 'px;');
    
    if (flip) {
    	box.addClass('arrow_box_right');
    }
    
    headingText = createElement('div');
    headingText.addClass('helpHeading');
	headingText.html(heading);
	headingText.parent(box);

    bodyText = createElement('div');
    bodyText.addClass('helpBody');
	bodyText.html(body);
	bodyText.parent(box);
	
	box.mousePressed(hideHelpBoxes);
	
	return box;
}

function toggleHelpBoxes() {
	if (helpBoxesShowing) {
		hideHelpBoxes();
	}
	else {
		showHelpBoxes();
	}
}

function showHelpBoxes() {
	helpBoxesShowing = true;
	for (var i=0; i < helpBoxes.length; i++) {
		helpBoxes[i].style('opacity: 1; ' + 
		  'opacity 0.25s linear;');
	}
}

function hideHelpBoxes() {
	helpBoxesShowing = false;
	for (var i=0; i < helpBoxes.length; i++) {
		helpBoxes[i].style('opacity: 0; ' + 
		  'transition: visibility 0s 0.25s, opacity 0.25s linear;');
	}
}