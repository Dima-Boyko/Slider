/*
* Dmitry Boyko
*04.12.2013
*24.12.2013
*tmgsoft@hotmail.com
*/
//******************************************************
/*
��������� �������
sName - ���������� Id �������� ��� #
sCount - ���������� ��������� � ��������
sMargin - ������ ��������
sInterval - (���) �������� ������� ��������
sAuto_interval - ����� ��� �������������� ��������   (������� �����)
sLook - ����� ����� ������� ������ (������� �����)
*/
//******************************************************

function SliderDIX(sName,sCount,sMargin,sInterval,sAuto_interval,sLook)
{
//******************************************************
//                      ���������
var count=sCount;           //�������� ������� � ��������
var margin=sMargin;        //������ �����
var interval=sInterval;     //�������� ������
var auto_interval=sAuto_interval;//����� ��� ���� ���������
var Look=sLook;//����� ��� ������ ������
//******************************************************
var width_ls='';          //������ ��������
var step =margin;        //����������� ��������
var loced=true;          //����������� ��� ��������
var element_count=0;     //���� ��������� � ��������
var element_left=0;
var animate_cont="next";//����������� ��������
var pause_step=0;       //������� ����� ����� ������� ������ �����
var pause=false;        //���������� ��������
var slider_loked=false;//���������� �������� ����� �� ������� ��������
//******************************************************
//��������� ��� �������
sName='#'+sName+' ';//������ � CSS + ID
  //������� ������� ����� ��� ��������
  $(sName+'img').each(function(i){
    $(sName+'img:eq('+i+')').css('left',i*margin) ;
  });
  element_count=$(sName+'img').length;//���������� ���������  � ��������
  //������ ��������
  width_ls=count* margin;
  $(sName+'.work').css('width',width_ls+'px') ;

//****************************************************** 
  // �������������� ��������
  // ��� - 1 �������� ��������
  var auto_slider=setInterval(function(){
    if(pause_step==0 && slider_loked==false)//��������
    {
        controler(animate_cont);
        pause_step=auto_interval; //������ ����� ��� ���� ���������
    }
    else //���������� ��������
    {
      pause_step--;//����� �����
      pause=false;//����� �������� �����
      if(pause_step<0)pause_step=0;
    }
    if(pause==true)pause_step=Look;  //����� - ����� ������ �����
    if(animate_cont=="prev")animate_cont="next";// ����� ������� �������� ����� ������� �� �������������.
  },interval+100);// + �������� ��� ��������� ���� ��������

//******************************************************
  //���� �������� � ��������� �� ������� �� ������� ����������
  $(window).bind('blur', function() {
    slider_loked=true;
  });
  $(window).bind('focus', function() {
    slider_loked=false;
  });



  //******************************************************
  // ������ ������� ����� ����������
  $(function(){
    $(sName+'#prev').click(function(){
      animate_cont='prev';
      pause_step=0;
      pause=true;
    });
    $(sName+'#next').click(function(){
      animate_cont='next';
      pause_step=0;
      pause=true;
    });
  });

  //******************************************************
  //�������� ���� �������� �� �������
  function animate(direction)
  {
    var left=0;
    //����������� ������������� ������
    $(sName+'img').each(function(i){
        left=$(sName+'img:eq('+i+')').position().left;
        if(direction=='prev')//� ����
        {
          left=left-step;
        }
        else                 //� �����
        {
          left=left+step;
        }
        // ��������
        $(sName+'img:eq('+i+')').animate({
          left: left+'px',
        },interval);
      });
      setTimeout(function(){loced=true},interval) ;  //���������
  }


  //******************************************************
  //���������� ������ ��� ��������
  //������� ���������� �������� � �������� ����� ���������
  function controler(direction)
  {
    loced=false;
    var left=0; //������� �������� � ��������
    element_left=-1;
    //���������� ������ �������� ����������� � ��������
    $(sName+'img').each(function(i){
      left=$(sName+'img:eq('+i+')').position().left;
      if(left<0 || left>width_ls-margin)$(sName+'img:eq('+i+')').css('display','none'); //��� �������� ��� �������� ������
      if(left==0 && element_left==-1 && $(sName+'img:eq('+i+')').css('display')=='block') element_left=i;  //������ ������� � ��������
    });
    //*****************************************
    //��������� ��������� �������, ������� �������
    var element_next=0;
    if(direction=='prev')//��������� ������� ����������� � �����
    {
      element_next=element_left+count; //��������� �������� � ����� �� �������
      //���� ��������� ��� � �����
      //����� ����� ����� ������� � ��������
      //����������� ���, ����� �� �������� ������ ��������
      //�������� ���������� ���������
      if(element_next>element_count-1) element_next= element_left-(element_count-count);
      $(sName+'img:eq('+element_next+')').css('display','block');
      $(sName+'img:eq('+element_next+')').css('left',width_ls) ;//���������� ���������
    }
    else //��������� ������� ����������� � ����
    {
      element_next=element_left-1;  // ��������� �������� � ����
      //���� �������� � ���� �����������
      if(element_next<0) element_next= element_count-1; // ����� ����� ������ ������� (���������)
      $(sName+'img:eq('+element_next+')').css('display','block');
      $(sName+'img:eq('+element_next+')').css('left',-margin) ; //���������� ����� ����� ����������
    }
    animate(direction); // ��������


  }

}