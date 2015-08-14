module.exports = function(){
  this.World = require('../support/world').World;

  this.Given(/^que possuo permissão para visualizar relatos$/, function(next){
  	//TODO: implement in permission issue
  	next();
  });
}