
module.exports = function(cb){
var Twit = require('twit');
var auth = {}
var T = new Twit(auth);
var stream = T.stream('statuses/filter', { track: ['a,e,i,o,u,r,s,t,c,b,g,z,y']});

var all = [], allu = [];
var arr = [], arru = [];
var count = {}, countu = {};
var total = 0;
var updateInterval = 2000;

stream.on('tweet', function (tweet) {
	total++;
	tweet.entities.hashtags.forEach(function(r){
	  var k = ('#'+r.text).toUpperCase();	
	  var n = count[k];
	  count[k] = ++n || 1;
	});

  tweet.entities.user_mentions.forEach(function(r){
    var k = ('@'+r.screen_name).toUpperCase(); 
    var n = countu[k];
    countu[k] = ++n || 1;
  });
  		
});

var interv = 150;

function show(){
  //console.log('\033[2J');
  var obj = {tags: [], users: []};

  for(i in count){
    all[i] = (all[i] || 1) + count[i];
  }
  arr.push(count);
  if(arr.length > interv){
    var remove = arr.shift();
    for(i in remove){
      all[i] = all[i] - remove[i];
    }
  }
  count = {};

  for(i in countu){
    allu[i] = (allu[i] || 1) + countu[i];
  }
  arru.push(countu);
  if(arru.length > interv){
    var remove = arru.shift();
    for(i in remove){
      allu[i] = allu[i] - remove[i];
    }
  }
  countu = {};


  var sortable = [];
  for(var val in all)
    sortable.push([val, all[val]])
  sortable.sort(function(a, b) {return b[1] - a[1]});
  sortable.slice(0, 20).forEach(function(kv){
  	obj.tags.push(kv);
  });

  var sortable = [];
  for(var val in allu)
    sortable.push([val, allu[val]])
  sortable.sort(function(a, b) {return b[1] - a[1]});
  sortable.slice(0, 20).forEach(function(kv){
    obj.users.push(kv);
  });
  //console.log(obj)

  cb(obj);
}
setInterval(show, updateInterval);

}
