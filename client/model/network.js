//Subscribe and create a collection on client side
Meteor.subscribe("inputActivationNodes")
Meteor.subscribe("hiddenActivationNodes")
Meteor.subscribe("outputActivationNodes");
Meteor.subscribe("weightsOutputNodes");
Meteor.subscribe("weightsInputNodes")

InputActivationNodes = new Meteor.Collection("inputActivationNodes");
HiddenActivationNodes = new Meteor.Collection("hiddenActivationNodes");
OutputActivationNodes = new Meteor.Collection("outputActivationNodes");
WeightsOutputNodes = new Meteor.Collection("weightsOutputNodes");
WeightsInputNodes = new Meteor.Collection("weightsInputNodes");
//Returns all resources
Template.inputNode.inputActivationNodesList = function(){
  return InputActivationNodes.find({});
};
Template.hiddenNode.hiddenActivationNodesList = function(){
  return HiddenActivationNodes.find({});
};
Template.outputNode.outputActivationNodesList = function(){
  return OutputActivationNodes.find({});
};
Template.outputWeight.weightsOutputNodesList = function(){
  return WeightsOutputNodes.find({});
};
Template.inputWeight.weightsInputNodesList = function(){
  return WeightsInputNodes.find({});
};


Template.next.events = {
  'click #iterate': function () { // <-- here it is
  			var one = $('#inputOne').val();
            var two = $('#inputTwo').val();
            var three = $('#inputThree').val();
            var four = $('#inputFour').val();
            var input = $('#input').val();
            var list = [one,two,three,four,input];
    Meteor.call('train',list); 
  },
  'click #test': function () { // <-- here it is
        var one = $('#inputOne').val();
            var two = $('#inputTwo').val();
            var three = $('#inputThree').val();
            var four = $('#inputFour').val();
            var list = [one,two,three,four];
    Meteor.call('test',list); 
  },
  'click #A': function () { // <-- here it is
            var list = [1,-1,-1,-1,1];
    Meteor.call('train',list); 
  },
  'click #B': function () { // <-- here it is
            var list = [-1,1,-1,-1,1];
    Meteor.call('train',list); 
  },
  'click #C': function () { // <-- here it is
            var list = [-1,-1,1,-1,1];
    Meteor.call('train',list); 
  },
  'click #D': function () { // <-- here it is
            var list = [1,1,1,1,0];
    Meteor.call('train',list); 
  }

};

Template.inputFields.events = {
	'keypress input': function(event) {
	   if (event.charCode == 13) {
            var one = $('#inputOne').val();
            var two = $('#inputTwo').val();
            var three = $('#inputThree').val();
            var four = $('#inputFour').val();
            var input = $('#input').val();
            var list = [one,two,three,four,input];

          Meteor.call('addInput',list); 
          $('#inputOne').val("");
          $('#inputTwo').val("");
          $('#inputThree').val("");
          $('#inputFour').val("");
          $('#input').val("");

    };
  },
  'keypress #inputFour':function(event){
    console.log(event.charCode);
   if(event.charCode == 97){
      var list = [1,1,1,1,1];
      Meteor.call('train',list); 
      var list = [0,0,0,0,0];
      Meteor.call('train',list); 
      
    };
    if(event.charCode == 115){
      var list = [0,1,0,0,1];
      Meteor.call('train',list); 
    };
    if(event.charCode == 100){
      var list = [0,0,1,0,1];
      Meteor.call('train',list); 
    };
    if(event.charCode == 102){
      var list = [0,0,0,1,1];
      Meteor.call('train',list); 
    };
    if(event.charCode == 103){
      var list = [0,0,0,1,1];
      Meteor.call('train',list); 
    };
    $('#inputFour').val("");
  }


};
  
