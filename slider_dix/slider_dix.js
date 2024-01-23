//******************************************************
/*
 * Dmitry Boyko
 * 04.12.2013
 * 24.12.2013
 * tmgsoft@hotmail.com
*/
//******************************************************
/*
Параметры функции
sName - уникальный Id слайдера без #
sCount - количество элементов в слайдере
sMargin - ширина элемента
sInterval - (шаг) интервал анимаии слайдера
sAuto_interval - пауза при автоматической анимации   (пропуск шагов)
sLook - пауза после ручного выбора (пропуск шагов)
*/
//******************************************************

function SliderDIX(sName,sCount,sMargin,sInterval,sAuto_interval,sLook)
{

//******************************************************
//                      НАСТРОЙКИ
var count=sCount;           //картинок видимых в слайдере
var margin=sMargin;        //ширина блока
var interval=sInterval;     //анимация блоков
var auto_interval=sAuto_interval;//пауза при авто прокрутке
var Look=sLook;//пауза при ручном выборе
//******************************************************
var width_ls='';          //ширина слайдера
var step =margin;        //перемещение картинки
var loced=false;          //блокировать при анимации
var element_count=0;     //всех елементов в листалке
var element_left=0;
var animate_cont="next";//направление анимации
var user_control=false;//ручная прокрутка
//var pause_step=0;       //пропуск шагов после ручного выбора блока
//var pause=false;        //остановить анимацию
var slider_loked=false;//блокировка анимации когда не активна страница
//var auto_slider=0;
var time=new Date().getTime(); //текущее время в UNIX
var time_pause=0; //остановить прокрутку слайдера в UNIX
//******************************************************
//Выполнить при запуске
sName='#'+sName+' ';//ID  + отступ в CSS
  //позиция каждого блока при загрузке
  jQuery(sName+'img').each(function(i){
    jQuery(sName+'img:eq('+i+')').css('left',i*margin) ;
  });
  element_count=jQuery(sName+'img').length;//количество елементов  в листалке
  //ширина листалки
  width_ls=count* margin;
  jQuery(sName+'.work').css('width',width_ls+'px') ;

//******************************************************
//Прокрутка элементов в слайдере
time_pause=time+auto_interval; //ожидание прокрутки
var auto_slider=setInterval(function()
{
  time=new Date().getTime(); //отщет времени
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
    jQuery(sName+'#prev').click(function(){      //назад
      animate_cont='prev';
      user_control=true;
    });

    jQuery(sName+'#next').click(function(){      //вперед
      animate_cont='next';
      user_control=true;
    });

    jQuery(sName+'img').click(function(){        //остановить для посмотра
      time_pause=time+Look;
    });
  });

  //******************************************************
  //Скролинг всех картинок по очереди
  function animate(direction)
  {
    var left=0;
    //поочередное пролистывание блоков
    jQuery(sName+'img').each(function(i){
        left=jQuery(sName+'img:eq('+i+')').position().left;
        if(direction=='prev')//в лево
        {
          left=left-step;
        }
        else                 //в право
        {
          left=left+step;
        }
        // Анимация
        jQuery(sName+'img:eq('+i+')').animate({
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
    jQuery(sName+'img').each(function(i){
      left=jQuery(sName+'img:eq('+i+')').position().left;
      if(left<0 || left>width_ls-margin)jQuery(sName+'img:eq('+i+')').css('display','none'); //все елементы вне слайдера скрыть
      if(left==0 && element_left==-1 && jQuery(sName+'img:eq('+i+')').css('display')=='block') element_left=i;  //первый элемент в слайдере
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
      jQuery(sName+'img:eq('+element_next+')').css('display','block');
      jQuery(sName+'img:eq('+element_next+')').css('left',width_ls) ;//разместить последним
    }
    else //следующий элемент размещается с лева
    {
      element_next=element_left-1;  // прокрутка элемента с лева
      //если элементы с лева закончились
      if(element_next<0) element_next= element_count-1; // берем самый правый элемент (последний)
      jQuery(sName+'img:eq('+element_next+')').css('display','block');
      jQuery(sName+'img:eq('+element_next+')').css('left',-margin) ; //разместить перед всеми элементами
    }
    animate(direction); // Анимация


  }

}