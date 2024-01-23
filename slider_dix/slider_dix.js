//******************************************************
/*
 * Dmitry Boyko
 * 01.11.2016 v6
 *
 * 04.12.2013
 * 24.12.2013
 * itdix.met
 * tmgsoft@hotmail.com
*/
//******************************************************
/*
��������� �������

sElement - ����� ������� ����� ���������
sCount - ���������� ��������� � ��������
sMargin - ������ ��������
sInterval - (���) �������� ������� ��������
sAuto_interval - ����� ��� �������������� ��������   (������� �����)
sLook - ����� ����� ������� ������ (������� �����)
*/
//******************************************************


//******************************************************

(function($){
  jQuery.fn.SliderDIX = function (slider_get)
//function SliderDIX(sName,sElement,sCount,sMargin,sInterval,sAuto_interval,sLook)
	{
	//******************************************************
	//��������� �� ���������
	var _slider_default=({
	  'element':'img',
	  'interval':1000,
	  'auto':2000,
	  'look':5000
	}) ;
	if(slider_get==undefined)slider_get=_slider_default;
	//******************************************************
	//                      ���������
	var _Slider=jQuery(this);
	var sElement=slider_get['element'];
	var count=0;           					//�������� ������� � ��������
	var margin=0;        					//������ �����
	var interval=slider_get['interval'];     //�������� ������
	var auto_interval=slider_get['auto'];//����� ��� ���� ���������
	var Look=slider_get['look'];//����� ��� ������ ������
	var but_prev='#sdprev';
	var but_next='#sdnext';
	//******************************************************
	//�������� ��������� �� ���������
	if(sElement==undefined)sElement=_slider_default['element'];
	if(interval==undefined)interval=_slider_default['interval'];
	if(auto_interval==undefined)auto_interval=_slider_default['auto'];
	if(Look==undefined)Look=_slider_default['look'];
	//******************************************************
	//
	margin=jQuery(sElement).width();
	count=Math.ceil(_Slider.width()/margin);
	//******************************************************
	//
	if(slider_get['prev']==undefined){
		_Slider.append('<div id="sdprev"></div>');
		but_prev=_Slider.find(but_prev);
	}else{
		but_prev=jQuery(slider_get['prev']);
	}
	
	if(slider_get['prev']==undefined){
		_Slider.append('<div id="sdnext"></div>');
		but_next=_Slider.find(but_next);
	}else{
		but_next=jQuery(slider_get['next']);
	}
	//******************************************************
	var width_ls='';          //������ ��������
	var step =margin;        //����������� ��������
	var loced=false;          //����������� ��� ��������
	var element_count=0;     //���� ��������� � ��������
	var element_left=0;
	var animate_cont="next";//����������� ��������
	var user_control=false;//������ ���������
	var slider_loked=false;//���������� �������� ����� �� ������� ��������
	//var auto_slider=0;
	var time=new Date().getTime(); //������� ����� � UNIX
	var time_pause=0; //���������� ��������� �������� � UNIX
	//******************************************************
	//��������� ��� �������
	//sName='#'+sName+' ';//ID  + ������ � CSS
	  //������� ������� ����� ��� ��������
	  _Slider.find(sElement).each(function(i,element){
		jQuery(element).css('left',i*margin) ;
	  });
	  element_count=jQuery(this).find(sElement).length;//���������� ���������  � ��������
	  //������ ��������
	  width_ls=count* margin;
	  //_Slider.find(work).css('width',width_ls+'px') ; 
	  jQuery(this).find(sElement).css('position','absolute');

	//******************************************************
	//��������� ��������� � ��������
	time_pause=time+auto_interval; //�������� ���������
	var auto_slider=setInterval(function()
	{
	  if(_Slider.css('display')=='none')
	  {
		slider_loked=true;
		
	  }
	  else
	  {
		slider_loked=false;
	  }

	  if(auto_interval>0)time=new Date().getTime();//����� �������  � ����������� �������������� ��������� ���� 0

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
		but_prev.click(function(){      //�����
		  animate_cont='prev';
		  user_control=true;
		});

		but_next.click(function(){      //������
		  animate_cont='next';
		  user_control=true;

		});

		_Slider.find(sElement).click(function(){        //���������� ��� ��������
		  time_pause=time+Look;
		});
	  });

	  //******************************************************
	  //�������� ���� �������� �� �������
	  function animate(direction)
	  {

		var left=0;
		//����������� ������������� ������
		_Slider.find(sElement).each(function(i,element){
			left=jQuery(element).position().left;
			if(direction=='prev')//� ����
			{
			  left=left-step;
			}
			else                 //� �����
			{
			  left=left+step;
			}
			// ��������
			jQuery(element).animate({
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
		_Slider.find(sElement).each(function(i,element){
		  left=jQuery(element).position().left;
		  if(left<0 || left>width_ls-margin)_Slider.find(sElement+':eq('+i+')').css('display','none'); //��� �������� ��� �������� ������
		  if(left==0 && element_left==-1 && _Slider.find(sElement+':eq('+i+')').css('display')=='block') element_left=i;  //������ ������� � ��������
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
		  _Slider.find(sElement+':eq('+element_next+')').css('display','block');
		  _Slider.find(sElement+':eq('+element_next+')').css('left',width_ls) ;//���������� ���������
		}
		else //��������� ������� ����������� � ����
		{
		  element_next=element_left-1;  // ��������� �������� � ����
		  //���� �������� � ���� �����������
		  if(element_next<0) element_next= element_count-1; // ����� ����� ������ ������� (���������)
		  _Slider.find(sElement+':eq('+element_next+')').css('display','block');
		  _Slider.find(sElement+':eq('+element_next+')').css('left',-margin) ; //���������� ����� ����� ����������
		}
		animate(direction); // ��������


	  }

	}
})(jQuery);