/*
* Dmitry Boyko
*04.12.2013
*24.12.2013
*tmgsoft@hotmail.com
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
var loced=true;          //блокировать при анимации
var element_count=0;     //всех елементов в листалке
var element_left=0;
var animate_cont="next";//направление анимации
var pause_step=0;       //пропуск шагов после ручного выбора блока
var pause=false;        //остановить анимацию
var slider_loked=false;//блокировка анимации когда не активна страница
//******************************************************
//Выполнить при запуске
sName='#'+sName+' ';//отступ в CSS + ID
  //позиция каждого блока при загрузке
  $(sName+'img').each(function(i){
    $(sName+'img:eq('+i+')').css('left',i*margin) ;
  });
  element_count=$(sName+'img').length;//количество елементов  в листалке
  //ширина листалки
  width_ls=count* margin;
  $(sName+'.work').css('width',width_ls+'px') ;

//****************************************************** 
  // Автоматический скролинг
  // Шаг - 1 анимация слайдера
  var auto_slider=setInterval(function(){
    if(pause_step==0 && slider_loked==false)//анимация
    {
        controler(animate_cont);
        pause_step=auto_interval; //задать паузу при авто прокрутке
    }
    else //пропустить анимацию
    {
      pause_step--;//щечик шагов
      pause=false;//сразу отменить паузу
      if(pause_step<0)pause_step=0;
    }
    if(pause==true)pause_step=Look;  //пауза - когда ручной выбор
    if(animate_cont=="prev")animate_cont="next";// после ручного перехода снова перейти на автоматическу.
  },interval+100);// + задержка для обработки всех скриптов

//******************************************************
  //если страница с слайдером не активна то слайдер остановлен
  $(window).bind('blur', function() {
    slider_loked=true;
  });
  $(window).bind('focus', function() {
    slider_loked=false;
  });



  //******************************************************
  // ручной переход между картинками
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
  //Скролинг всех картинок по очереди
  function animate(direction)
  {
    var left=0;
    //поочередное пролистывание блоков
    $(sName+'img').each(function(i){
        left=$(sName+'img:eq('+i+')').position().left;
        if(direction=='prev')//в лево
        {
          left=left-step;
        }
        else                 //в право
        {
          left=left+step;
        }
        // Анимация
        $(sName+'img:eq('+i+')').animate({
          left: left+'px',
        },interval);
      });
      setTimeout(function(){loced=true},interval) ;  //следующий
  }


  //******************************************************
  //Подготовка блоков для анимации
  //порядок размещения картинок в слайдере перед анимацией
  function controler(direction)
  {
    loced=false;
    var left=0; //позиция елемента в слайдере
    element_left=-1;
    //Показывать только елементы участвующие в анимации
    $(sName+'img').each(function(i){
      left=$(sName+'img:eq('+i+')').position().left;
      if(left<0 || left>width_ls-margin)$(sName+'img:eq('+i+')').css('display','none'); //все елементы вне слайдера скрыть
      if(left==0 && element_left==-1 && $(sName+'img:eq('+i+')').css('display')=='block') element_left=i;  //первый элемент в слайдере
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
      $(sName+'img:eq('+element_next+')').css('display','block');
      $(sName+'img:eq('+element_next+')').css('left',width_ls) ;//разместить последним
    }
    else //следующий элемент размещается с лева
    {
      element_next=element_left-1;  // прокрутка элемента с лева
      //если элементы с лева закончились
      if(element_next<0) element_next= element_count-1; // берем самый правый элемент (последний)
      $(sName+'img:eq('+element_next+')').css('display','block');
      $(sName+'img:eq('+element_next+')').css('left',-margin) ; //разместить перед всеми элементами
    }
    animate(direction); // Анимация


  }

}