var width_ls='';
var margin=180;
var step =margin;
var loced=true;
var interval=1000;
var auto_interval=2000;
var count=5;
var element_count=0;
var element_left=0;
var animate_cont="next";
var pause_step=0;
var pause_step=0;
var pause=false;
var slider_loked=false;
$(document).ready(function(){
  $('img').each(function(i){
    $('img:eq('+i+')').css('left',i*margin) ;
  });
  element_count=$('img').length;
  width_ls=count* margin;
  $('#slider .work').css('width',width_ls+'px') ;
  var auto_slider=setInterval(function(){
    if(pause_step==0 && slider_loked==false)
    {
      controler(animate_cont);
    }
    else
    {
      pause_step--;
      pause=false;
      if(pause_step<0)pause_step=0;
    }
    if(pause==true)pause_step=3;
    if(animate_cont=="prev")animate_cont="next";
  },auto_interval);
  //
  $(window).bind('blur', function() {
    slider_loked=true;
  });
  $(window).bind('focus', function() {
    slider_loked=false;
  });
});
$(function(){
  $('#next').click(function(){
    animate_cont='prev';
    pause_step=0;
    pause=true;
  });
  $('#prev').click(function(){
    animate_cont='next';
    pause_step=0;
    pause=true;
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