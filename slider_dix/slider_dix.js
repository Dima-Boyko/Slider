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
Параметры функции

sElement - блоки которые будут вращаться
sCount - количество элементов в слайдере
sMargin - ширина элемента
sInterval - (шаг) интервал анимаии слайдера
sAuto_interval - пауза при автоматической анимации   (пропуск шагов)
sLook - пауза после ручного выбора (пропуск шагов)
*/
//******************************************************


//******************************************************

(function($){
  jQuery.fn.SliderDIX = function (slider_get)
//function SliderDIX(sName,sElement,sCount,sMargin,sInterval,sAuto_interval,sLook)
	{
	//******************************************************
	//Параметры по умолчанию
	var _slider_default=({
	  'element':'img',
	  'interval':1000,
	  'auto':2000,
	  'look':5000
	}) ;
	if(slider_get==undefined)slider_get=_slider_default;
	//******************************************************
	//                      НАСТРОЙКИ
	var _Slider=jQuery(this);
	var sElement=slider_get['element'];
	var count=0;           					//картинок видимых в слайдере
	var margin=0;        					//ширина блока
	var interval=slider_get['interval'];     //анимация блоков
	var auto_interval=slider_get['auto'];//пауза при авто прокрутке
	var Look=slider_get['look'];//пауза при ручном выборе
	var but_prev='#sdprev';
	var but_next='#sdnext';
	//******************************************************
	//Добавить параметры по умолчанию
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
	var width_ls='';          //ширина слайдера
	var step =margin;        //перемещение картинки
	var loced=false;          //блокировать при анимации
	var element_count=0;     //всех елементов в листалке
	var element_left=0;
	var animate_cont="next";//направление анимации
	var user_control=false;//ручная прокрутка
	var slider_loked=false;//блокировка анимации когда не активна страница
	//var auto_slider=0;
	var time=new Date().getTime(); //текущее время в UNIX
	var time_pause=0; //остановить прокрутку слайдера в UNIX
	//******************************************************
	//Выполнить при запуске
	//sName='#'+sName+' ';//ID  + отступ в CSS
	  //позиция каждого блока при загрузке
	  _Slider.find(sElement).each(function(i,element){
		jQuery(element).css('left',i*margin) ;
	  });
	  element_count=jQuery(this).find(sElement).length;//количество елементов  в листалке
	  //ширина листалки
	  width_ls=count* margin;
	  //_Slider.find(work).css('width',width_ls+'px') ; 
	  jQuery(this).find(sElement).css('position','absolute');

	//******************************************************
	//Прокрутка элементов в слайдере
	time_pause=time+auto_interval; //ожидание прокрутки
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

	  if(auto_interval>0)time=new Date().getTime();//отщет времени  и блокировать автоматической прокрутки если 0

	  if(loced==false)  //анимация завершена
	  {
		//анимация элементов после таймаута
		//если пользователь не выбрал направление сам
		//также весь слайдер блокируется если страница потерялп фокус
		if(time>time_pause && slider_loked==false || user_control==true)
		{
		  controler(animate_cont);//анимация
		  if(user_control==true)   //настроки после ручного выбора элемента
		  {
			time_pause=time+Look;  //задержка чтобы посмотреть на элементы
			user_control=false;    //слейдер переключается после задержки в автоматический режим
			animate_cont="next";   //вернутся к стандартному направлению элементов
		  }
		  else                     //настройки автоматического режима
		  {
			time_pause=time+auto_interval; //интервал для автоматической анимации
		  }
		}
	  }
	},300);//интервал для проверки
	//******************************************************
	  //если страница с слайдером не активна то слайдер остановлен
	  jQuery(window).bind('blur', function() {
		slider_loked=true;
	  });
	  jQuery(window).bind('focus', function() {
		slider_loked=false;
	  });



	  //******************************************************
	  // ручной переход между картинками
	  jQuery(function(){
		but_prev.click(function(){      //назад
		  animate_cont='prev';
		  user_control=true;
		});

		but_next.click(function(){      //вперед
		  animate_cont='next';
		  user_control=true;

		});

		_Slider.find(sElement).click(function(){        //остановить для посмотра
		  time_pause=time+Look;
		});
	  });

	  //******************************************************
	  //Скролинг всех картинок по очереди
	  function animate(direction)
	  {

		var left=0;
		//поочередное пролистывание блоков
		_Slider.find(sElement).each(function(i,element){
			left=jQuery(element).position().left;
			if(direction=='prev')//в лево
			{
			  left=left-step;
			}
			else                 //в право
			{
			  left=left+step;
			}
			// Анимация
			jQuery(element).animate({
			  left: left+'px',
			},interval);
		  });
		  setTimeout(function(){loced=false},interval) ;  //следующий
	  }


	  //******************************************************
	  //Подготовка блоков для анимации
	  //порядок размещения картинок в слайдере перед анимацией
	  function controler(direction)
	  {
		loced=true;
		var left=0; //позиция елемента в слайдере
		element_left=-1;
		//Показывать только елементы участвующие в анимации
		_Slider.find(sElement).each(function(i,element){
		  left=jQuery(element).position().left;
		  if(left<0 || left>width_ls-margin)_Slider.find(sElement+':eq('+i+')').css('display','none'); //все елементы вне слайдера скрыть
		  if(left==0 && element_left==-1 && _Slider.find(sElement+':eq('+i+')').css('display')=='block') element_left=i;  //первый элемент в слайдере
		});
		//*****************************************
		//Следующий выежающий елемент, сделать видимым
		var element_next=0;
		if(direction=='prev')//следующий элемент размещается с права
		{
		  element_next=element_left+count; //прокрутка элемента с права от видимых
		  //если элементов нет с права
		  //берем самый левый элемент в слайдере
		  //Прощитываем так, берем от видимого левого элемента
		  //отнимаем количество невидимых
		  if(element_next>element_count-1) element_next= element_left-(element_count-count);
		  _Slider.find(sElement+':eq('+element_next+')').css('display','block');
		  _Slider.find(sElement+':eq('+element_next+')').css('left',width_ls) ;//разместить последним
		}
		else //следующий элемент размещается с лева
		{
		  element_next=element_left-1;  // прокрутка элемента с лева
		  //если элементы с лева закончились
		  if(element_next<0) element_next= element_count-1; // берем самый правый элемент (последний)
		  _Slider.find(sElement+':eq('+element_next+')').css('display','block');
		  _Slider.find(sElement+':eq('+element_next+')').css('left',-margin) ; //разместить перед всеми элементами
		}
		animate(direction); // Анимация


	  }

	}
//***********************************************************************************************************
jQuery.fn.SliderDO = function (slider_get){
    //******************************************************
	//Параметры по умолчанию
	var _slider_default=({
	  'element':'img',
	  'interval':500,
	  'auto':2000,
	  'look':5000
	}) ;
	if(slider_get==undefined)slider_get=_slider_default;
	//******************************************************
    //******************************************************
	//                      НАСТРОЙКИ
	var _Slider=jQuery(this);
    var sElement=slider_get['element'];
    var _length=0;
    var interval=slider_get['interval'];     //анимация блоков
	var auto_interval=slider_get['auto'];//пауза при авто прокрутке
    var but_prev='#sdprev';
	var but_next='#sdnext';
    //******************************************************
	//Добавить параметры по умолчанию
	if(sElement==undefined)sElement=_slider_default['element'];
	if(interval==undefined)interval=_slider_default['interval'];
	if(auto_interval==undefined)auto_interval=_slider_default['auto'];
	//if(Look==undefined)Look=_slider_default['look'];
	//******************************************************
    //******************************************************
	//
	_Slider.append('<div id="sdprev"></div>');
    but_prev=_Slider.find(but_prev);
	_Slider.append('<div id="sdnext"></div>');
    but_next=_Slider.find(but_next);
    //******************************************************
    _Slider.find(sElement+':eq(0)').addClass('activ');
    _Slider.find(sElement+':eq(0)').css('opacity',1);
    _length=_Slider.find(sElement).length;
    //******************************************************
    //Кнопки выбора
    but_prev.click(function(){
      var _activ=_Slider.find('.activ');
      //Анимацыя исчезновения
      _activ.animate({opacity:0},interval).queue(function(){
        _activ.removeClass('activ') ;
        if(_activ.prev(sElement).length>0){ //показать следующий
            _activ.prev().addClass('activ') ;

        }else{ //блоки закончились показать первый
          _Slider.find(sElement).last().addClass('activ');
        }
        //Покаать новый блок
        _Slider.find('.activ').animate({opacity: 1},interval);
        //завершение анимации
        jQuery(this).dequeue();
      });

    })
    but_next.click(function(){
      var _activ=_Slider.find('.activ');
      //Анимацыя исчезновения
      _activ.animate({opacity:0},interval).queue(function(){
        _activ.removeClass('activ') ;
        if(_activ.next(sElement).length>0){ //показать следующий
            _activ.next().addClass('activ') ;

        }else{ //блоки закончились показать первый
          _Slider.find(sElement).first().addClass('activ');
        }
        //Покаать новый блок
        _Slider.find('.activ').animate({opacity: 1},interval);
        //завершение анимации
        jQuery(this).dequeue();
      });

    })

}


})(jQuery);