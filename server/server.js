InputActivationNodes = new Meteor.Collection("inputActivationNodes");
HiddenActivationNodes = new Meteor.Collection("hiddenActivationNodes");
OutputActivationNodes = new Meteor.Collection("outputActivationNodes");
WeightsOutputNodes = new Meteor.Collection("weightsOutputNodes");
WeightsInputNodes = new Meteor.Collection("weightsInputNodes");

var numInput;
	var numHidden;
	var learningRate;

	var inputActivation;
	var hiddenActivation;
	var outputActivation;
	
	var weightsInput;
	var weightsOutput;
	var deltaOutput;
	var deltaHidden;

	var prevInputActivation;
	var prevHiddenActivations;
	var prevDeltaOutput;
	var prevOutputActivation;
	var prevDeltaHidden;
	var output;
	
	var error;
	var actualOutput;




Meteor.publish("inputActivationNodes",function(){
	return InputActivationNodes.find({});
});
Meteor.publish("hiddenActivationNodes",function(){
	return HiddenActivationNodes.find({});
});
Meteor.publish("outputActivationNodes",function(){
	return OutputActivationNodes.find({});
});
Meteor.publish("weightsOutputNodes",function(){
	return WeightsOutputNodes.find({});
});
Meteor.publish("weightsInputNodes",function(){
	return WeightsInputNodes.find({});
});


Meteor.startup(function () {
	numInput = 5;
	numHidden = 5;
	inputActivation = Array.apply(null, new Array(numHidden)).map(Number.prototype.valueOf,0);
	hiddenActivation = Array.apply(null, new Array(numHidden)).map(Number.prototype.valueOf,0);
	outputActivation = 0;
	learningRate = 1.0;
	weightsInput = Meteor.call('makeMatrix',numInput,numHidden);
	
	weightsOutput = Array.apply(null, new Array(numHidden)).map(Number.prototype.valueOf,0);
	for (i = 0; i < weightsOutput.length-1; i++) { 
		weightsOutput[i] = (Meteor.call('randomNumber'));
	};
	prevInputActivation = Array.apply(null, new Array(numHidden)).map(Number.prototype.valueOf,0);
	prevHiddenActivations = Array.apply(null, new Array(numHidden)).map(Number.prototype.valueOf,0);
	prevDeltaOutput = 0;
	prevOutputActivation = 0;
	prevDeltaHidden = Array.apply(null, new Array(numHidden)).map(Number.prototype.valueOf,0);
	

	deltaOutput = 0;
	deltaHidden = [];

	actualOutput = 0;

	//Bias
	inputActivation[numInput-1] = -1;

	//Old

	InputActivationNodes.remove({});
	HiddenActivationNodes.remove({});
	OutputActivationNodes.remove({});
	WeightsInputNodes.remove({});
	WeightsOutputNodes.remove({});

    var m = 90000;
    var mi = 10000;
    var d = 100000;

      InputActivationNodes.insert({value:1});
      InputActivationNodes.insert({value:0});
      InputActivationNodes.insert({value:0});
      InputActivationNodes.insert({value:0});


      HiddenActivationNodes.insert({value:0});
      HiddenActivationNodes.insert({value:0});
      HiddenActivationNodes.insert({value:0});
      HiddenActivationNodes.insert({value:0});
    

    OutputActivationNodes.insert({value:0});
  });


Meteor.methods({
	'propagate':function(inputList){
		//Clear database
		InputActivationNodes.remove({});
		HiddenActivationNodes.remove({});
		OutputActivationNodes.remove({});
		WeightsInputNodes.remove({});
		WeightsOutputNodes.remove({});
		
		//Input 
		for (i = 0; i < inputList.length-1; i++) { 
			inputActivation[i] = inputList[i];
			//Adding to mongodb
			InputActivationNodes.insert({value:(inputList[i])});
		};
		//Hidden
		for (i = 0; i < hiddenActivation.length; i++) { 
			var sum = 0;
			for (j = 0; j < inputActivation.length; j++) { 
				sum = sum + (inputActivation[j]*weightsInput[i][j]);
				console.log("Input: " + inputActivation[j])
				console.log("Weight : " +  weightsInput[i][j]);
			};
			console.log("Sum: "+ sum)
			hiddenActivation[i] = (Meteor.call('sigmoidFunction',sum));
			//Adding to mongodb
			console.log("hiddenActivation : " + hiddenActivation[i])
			HiddenActivationNodes.insert({value:hiddenActivation[i]});
		};
		//console.log("hiddenActivation " + hiddenActivation);


		//output activations
		var sum = 0;
		for (i = 0; i < numHidden; i++) { 
            sum = sum + parseFloat(hiddenActivation[i]*weightsOutput[i]);
        };
        //outputActivation = Meteor.call('logFunc',sum);
        outputActivation = Meteor.call('sigmoidFunction',sum);
        	

        //console.log("outputActivation " + outputActivation);
        //Adding to mongodb
        OutputActivationNodes.insert({value:outputActivation});
        actualOutput = inputList[4];
        //console.log(inputList);

	},
	'computeOutputDelta':function(){	
		deltaOutput = (outputActivation*(1 - outputActivation)*(actualOutput - outputActivation));
		//console.log("Deltaoutpuut " + deltaOutput);
	
	},
	'computeHiddenDelta':function(){
		for (i = 0; i < numHidden; i++) { 
			deltaHidden[i] = (hiddenActivation[i]*(1 - hiddenActivation[i])*(deltaOutput*weightsOutput[i]));
		};
		//console.log("deltaHidden " + deltaHidden);
		
	},
	'sigmoidFunction':function(x){
		return 1/(1+Math.pow(Math.E, -x));
	},
	'randomNumber':function(){
		return Math.random() * (1.0 - (-1.0)) + (-1.0);
	},

	'logFunc':function(x){
		return (1.0/(1.0+Math.exp(-x)));
	},
	'logFuncDerivative':function(x){
		return Math.exp(-x)/Math.pow(Math.exp(-x)+1,2);
	},
	'makeMatrix':function(numInput,numHidden){
		var m = [];
		for (i = 0; i < numInput; i++) {
			var n = []; 
			for (j = 0; j < numHidden; j++) { 
				n.push([(Meteor.call('randomNumber'))]);
			};
			m.push(n);
		};
		return m;
	},
	'updateWeights':function(){

		for (i = 0; i < numInput; i++) { 
			for (j = 0; j < numHidden; j++) {
				
				weightsInput[i][j] = parseFloat(weightsInput[i][j]) + (deltaHidden[j]*inputActivation[j])//Er ikke helt sikker!!! Om det skal være i eller j
				//Addining to MongoDB
				WeightsInputNodes.insert({weight:weightsInput[i][j]});
			};
		};
		for (i = 0; i < numHidden; i++) { 
			//Weight is the previous weight pluss the error multiplied with the output from the hidden node
			weightsOutput[i] = (weightsOutput[i]) + (deltaOutput*hiddenActivation[i]);
			//Adding to MongoDB
			WeightsOutputNodes.insert({weight:weightsOutput[i]});
		};
		console.log("weightsInput " + weightsInput);
		//console.log("weightsOutput " + weightsOutput);
	},

	'backpropate':function(){
		//console.log("Computing outputdelta");
		Meteor.call('computeOutputDelta');

		//console.log("Computing hiddendelta");
		Meteor.call('computeHiddenDelta');

		//console.log("updataing weights");
		Meteor.call('updateWeights');


	},
	'train':function(inputList){
		Meteor.call('propagate',inputList);
		//console.log("Finished propagate, continue with backpropate")
		Meteor.call('backpropate');

		//console.log("Finished backpropate");
		//console.log(".....");
		//console.log(".....");
		
		
		//console.log("Actual output");
		//console.log(actualOutput);
		//console.log("OutputActivation");
		//console.log(outputActivation);
		console.log("Error:");
		console.log(actualOutput- outputActivation);
	},
	'test':function(inputList){
		InputActivationNodes.remove({});
		HiddenActivationNodes.remove({});
		OutputActivationNodes.remove({});
		//Input 
		for (i = 0; i < inputList.length; i++) { 
			inputActivation[i] = inputList[i];
			//Adding to mongodb
			InputActivationNodes.insert({value:(inputList[i])});
		};
		//Hidden
		for (i = 0; i < hiddenActivation.length; i++) { 
			var sum = 0;
			for (j = 0; j < inputActivation.length; j++) { 
				sum = sum + (inputActivation[j]*weightsInput[i][j]);
				
			};
			
			hiddenActivation[i] = (Meteor.call('sigmoidFunction',sum));
			//Adding to mongodb
			HiddenActivationNodes.insert({value:hiddenActivation[i]});
		};
		
		//output activations
		var sum = 0;
		for (i = 0; i < numHidden; i++) { 
            sum = sum + parseFloat(hiddenActivation[i]*weightsOutput[i]);
        };
        //outputActivation = Meteor.call('logFunc',sum);
        outputActivation = Meteor.call('sigmoidFunction',sum);

        //Adding to mongodb
        OutputActivationNodes.insert({value:outputActivation});
	}
});


