var width_ls='';
var margin=180;
var step =margin;
var loced=true;
var interval=1000;
var count=5;
var element_count=0;
var element_left=0;
var auto_slider=0;
$(document).ready(function(){
  $('img').each(function(i){
    $('img:eq('+i+')').css('left',i*margin) ;
  });
  element_count=$('img').length;
  width_ls=count* margin;
  $('#slider .work').css('width',width_ls+'px') ;
  //$('img:last').css('left',-margin) ;
});
$(function(){
  $('#next').click(function(){
    if(loced==true)controler('prev');
  });
  $('#prev').click(function(){
    if(loced==true)controler('next');
  });
});

function animate(direction)
{
  var left=0;
  $('img').each(function(i){
      left=$('img:eq('+i+')').position().left;
      if(direction=='prev')
      {
        left=left-step;
      }
      else
      {
        left=left+step;
      }
      $('img:eq('+i+')').animate({
        left: left+'px',
      },interval);
    });
    setTimeout(function(){loced=true},interval) ;
}

function controler(direction)
{
  loced=false;
  var left=0;
  element_left=-1;
  $('img').each(function(i){
    left=$('img:eq('+i+')').position().left;
    if(left<0 || left>width_ls-margin)$('img:eq('+i+')').css('display','none');
    if(left==0 && element_left==-1 && $('img:eq('+i+')').css('display')=='block') element_left=i;
  });
  var element_next=0;
  if(direction=='prev')
  {
    element_next=element_left+count;
    if(element_next>element_count-1) element_next= element_left-1;
    $('img:eq('+element_next+')').css('display','block');
    $('img:eq('+element_next+')').css('left',width_ls) ;
  }
  else
  {
    element_next=element_left-1;
    if(element_next<0) element_next= element_count-1;
    $('img:eq('+element_next+')').css('display','block');
    $('img:eq('+element_next+')').css('left',-margin) ;
  }
  animate(direction);


}