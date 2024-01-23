//******************************************************
/*
 * Dmitry Boyko
 * 04.12.2013
 * 24.12.2013
 * tmgsoft@hotmail.com
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
var loced=false;          //����������� ��� ��������
var element_count=0;     //���� ��������� � ��������
var element_left=0;
var animate_cont="next";//����������� ��������
var user_control=false;//������ ���������
//var pause_step=0;       //������� ����� ����� ������� ������ �����
//var pause=false;        //���������� ��������
var slider_loked=false;//���������� �������� ����� �� ������� ��������
//var auto_slider=0;
var time=new Date().getTime(); //������� ����� � UNIX
var time_pause=0; //���������� ��������� �������� � UNIX
//******************************************************
//��������� ��� �������
sName='#'+sName+' ';//ID  + ������ � CSS
  //������� ������� ����� ��� ��������
  jQuery(sName+'img').each(function(i){
    jQuery(sName+'img:eq('+i+')').css('left',i*margin) ;
  });
  element_count=jQuery(sName+'img').length;//���������� ���������  � ��������
  //������ ��������
  width_ls=count* margin;
  jQuery(sName+'.work').css('width',width_ls+'px') ;

//******************************************************
//��������� ��������� � ��������
time_pause=time+auto_interval; //�������� ���������
var auto_slider=setInterval(function()
{
  time=new Date().getTime(); //����� �������
  if(loced==false)  //�������� ���������
  {
    //�������� ��������� ����� ��������
    //���� ������������ �� ������ ����������� ���
    //����� ���� ������� ����������� ���� �������� �������� �����
    if(time>time_pause && slider_loked==false || user_control==true)
    {
      controler(animate_cont);//��������
      if(user_control==true)   //�������� ����� ������� ������ ��������
      {
        time_pause=time+Look;  //�������� ����� ���������� �� ��������
        user_control=false;    //������� ������������� ����� �������� � �������������� �����
        animate_cont="next";   //�������� � ������������ ����������� ���������
      }
      else                     //��������� ��������������� ������
      {
        time_pause=time+auto_interval; //�������� ��� �������������� ��������
      }
    }
  }
},300);//�������� ��� ��������
//******************************************************
  //���� �������� � ��������� �� ������� �� ������� ����������
  jQuery(window).bind('blur', function() {
    slider_loked=true;
  });
  jQuery(window).bind('focus', function() {
    slider_loked=false;
  });



  //******************************************************
  // ������ ������� ����� ����������
  jQuery(function(){
    jQuery(sName+'#prev').click(function(){      //�����
      animate_cont='prev';
      user_control=true;
    });

    jQuery(sName+'#next').click(function(){      //������
      animate_cont='next';
      user_control=true;
    });

    jQuery(sName+'img').click(function(){        //���������� ��� ��������
      time_pause=time+Look;
    });
  });

  //******************************************************
  //�������� ���� �������� �� �������
  function animate(direction)
  {
    var left=0;
    //����������� ������������� ������
    jQuery(sName+'img').each(function(i){
        left=jQuery(sName+'img:eq('+i+')').position().left;
        if(direction=='prev')//� ����
        {
          left=left-step;
        }
        else                 //� �����
        {
          left=left+step;
        }
        // ��������
        jQuery(sName+'img:eq('+i+')').animate({
          left: left+'px',
        },interval);
      });
      setTimeout(function(){loced=false},interval) ;  //���������
  }


  //******************************************************
  //���������� ������ ��� ��������
  //������� ���������� �������� � �������� ����� ���������
  function controler(direction)
  {
    loced=true;
    var left=0; //������� �������� � ��������
    element_left=-1;
    //���������� ������ �������� ����������� � ��������
    jQuery(sName+'img').each(function(i){
      left=jQuery(sName+'img:eq('+i+')').position().left;
      if(left<0 || left>width_ls-margin)jQuery(sName+'img:eq('+i+')').css('display','none'); //��� �������� ��� �������� ������
      if(left==0 && element_left==-1 && jQuery(sName+'img:eq('+i+')').css('display')=='block') element_left=i;  //������ ������� � ��������
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
      jQuery(sName+'img:eq('+element_next+')').css('display','block');
      jQuery(sName+'img:eq('+element_next+')').css('left',width_ls) ;//���������� ���������
    }
    else //��������� ������� ����������� � ����
    {
      element_next=element_left-1;  // ��������� �������� � ����
      //���� �������� � ���� �����������
      if(element_next<0) element_next= element_count-1; // ����� ����� ������ ������� (���������)
      jQuery(sName+'img:eq('+element_next+')').css('display','block');
      jQuery(sName+'img:eq('+element_next+')').css('left',-margin) ; //���������� ����� ����� ����������
    }
    animate(direction); // ��������


  }

}