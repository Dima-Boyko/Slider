//******************************************************
/*
 * Dmitry Boyko
 * v2,0
 * 03.06.2023
 *
 * 04.12.2013
 * tmgsoft@hotmail.com
*/
//******************************************************
/*
Параметры сладеров
element - css елемент в сладере
interval - длительность анимации
auto - пауза между анимациями / 0 - откоючить автоматическую анимацию
look - пауза при ручном выборе
adaptive - если передать yes то адаптация работает (по высоте внутрених блоков)
prev и next - кноки для переключения
*/
//******************************************************

function SliderDIX(_selector='',_setting={}){
	if(_selector=='')return false;
	return new slider_dix(_selector,_setting);
}


class slider_dix{
	constructor(_selector='',_setting={},_auto=true){
		this.selector=_selector;
		this.setting=_setting;
		this.sliders=[];

		if(_auto){
			let t=this;
			window.addEventListener('load', function(){
				t.Start();
			});
		}
		
	}

	setSelector(_selector=''){
		if(_selector=='')return false;
		this.selector=_selector;
	}

	Start(){
		if(this.selector=='')return false;
		let t=this;
		document.querySelectorAll(this.selector).forEach(function(_slider){
			t.sliders.push(new slider_dix_core(_slider,t.setting));
		});	

		return this.sliders;
	}

	Stop(){
		alert('Stop slider');
	}
}

class slider_dix_core{

	constructor(_slider={},_setting={},_auto=true){
		if (typeof _slider !== 'object')return false;
		this.slider=_slider;
		this.elements;
		this.selector='';
		this.setting={};
		this.width=0;
		this.max_width=0;
		this.height=0;
		this.ImgPos=0;
		this.imgFirst={};
		this.imgLast={};
		this.animate_time=0;
		this.animate_step=0;
		this.width_elemen=0;
		this.butNext;
		this.butPrev;
		this.AutoInterval;
		this.locked=false;
		this.time_pause=0;
		this.page_active=true;

	

		if(_auto){
			this.setSetting(_setting);
			this.Start();
		}

	}

	setSelector(_selector=''){
		if(_selector=='')return false;
		this.slider=document.querySelector(this.selector);
		this.selector=_selector;
	}

	setSlider(_slider){
		this.slider=_slider;
	}

	setSetting(_setting={}){
		this.setting=_setting;
		if(typeof this.setting.element === 'undefined')this.setting.element='img';
		if(typeof this.setting.auto === 'undefined')this.setting.auto=3000;
		if(typeof this.setting.auto_always === 'undefined')this.setting.auto_always=false;
		if(typeof this.setting.look === 'undefined')this.setting.look=5000;
		if(typeof this.setting.prev === 'undefined')this.setting.prev='';
		if(typeof this.setting.next === 'undefined')this.setting.next='';
		if(typeof this.setting.interval === 'undefined')this.setting.interval=1000;
		if(typeof this.setting.step === 'undefined')this.setting.step=1;
		if(typeof this.setting.auto_move === 'undefined')this.setting.auto_move='right';
	}

	Query(_selector=''){
		if(_selector=='')return this.slider;
		return this.slider.querySelector(_selector);
	}

	QueryList(_selector=''){
		if(_selector=='')return this.slider;
		return this.slider.querySelectorAll(_selector);
	}

	Start(){	
		
		this.Update();
		this.AddButtons();
		this.Auto();

		this.Query().addEventListener('mousemove',()=>{
			this.time_pause=this.Time()+this.setting.look;
		});

		document.addEventListener('visibilitychange', function() {
			if (document.visibilityState === 'visible') {
				this.page_active=true;
			} else {
				this.page_active=false;
			}
		});

		window.addEventListener('resize',()=>{
			this.Update();
		});

	}

	Update(){
		let t=this;
		this.max_width=0;
		this.ImgPos=0;
		this.Query().style.position='relative';
		this.Query().style.overflow='hidden';
		this.width=this.Query().clientWidth;
		this.height=this.Query().clientHeight;
		this.elements=this.QueryList(this.setting.element);

		this.elements.forEach(function(i){
			i.style.position='absolute';
			i.style.top ='0px';
			i.style.left =t.ImgPos+'px';
			t.ImgPos+=i.offsetWidth;
			t.max_width+=i.offsetWidth;
		});

	}


	

	AddButtons(){

		if(this.setting.next==''){
			this.butNext = document.createElement('div');
			this.butNext.className = 'sd-next';
			this.Query().appendChild(this.butNext);
		}else{
			this.butNext=document.querySelector(this.setting.next);
		}

		if(this.setting.prev==''){
			this.butPrev = document.createElement('div');
			this.butPrev.className = 'sd-prev';
			this.Query().appendChild(this.butPrev);
		}else{
			this.butPrev=document.querySelector(this.setting.prev);
		}
		

		let t=this;
		this.butNext.addEventListener('click', function() {
			t.Move('right');
		});

		this.butPrev.addEventListener('click', function() {
		   t.Move('left');
		});
	}



	Move(_direction='right'){
		
		if(this.locked)return false;

		this.locked=true;
		let _speed=this.setting.step;
		if(_direction=='left')_speed=-_speed;

		this.Teleport(_direction);


		
		this.animate_step=this.width_elemen/this.setting.step;
		this.animate_time=this.setting.interval/this.animate_step;


		let t=this;
		let i=0;
		let anim = setInterval(function(){
			t.QueryList(t.setting.element).forEach(function(e){
				e.style.left=(parseFloat(e.style.left)+_speed)+'px';
			});
			i++;
			if(i>=t.animate_step){
				clearInterval(anim);
				
				t.locked=false;
			}
		},this.animate_time);
	}

	Teleport(_direction='right'){
		
		
		let t=this;
		let minLeft=0;
		let maxLeft=0;
		let maxLeftWidth=0;
		let _left=0;
		let _element_teleport='';
		let _element_move='';
		let _need=true;



		this.QueryList(this.setting.element).forEach(function(e){
			_left=parseFloat(e.style.left);
			
			if(minLeft>_left){
				minLeft=_left;
				if(_direction=='left'){
					_element_teleport=e;
				}
				
			}
			if(maxLeft<_left){
				maxLeft=_left;
				maxLeftWidth=_left+e.offsetWidth;
				if(_direction=='right'){
					_element_teleport=e;
				}
				
			}

			if(_direction=='left' && _left<=t.width+5 &&  _left+e.offsetWidth>=t.width+5){
				_element_move=e;
			}
			if(_direction=='right' && _left<=-5 &&  _left+e.offsetWidth>=-5){
				_element_move=e;
			}
		});


		if(_element_move=='')_element_move=_element_teleport;
		this.width_elemen=_element_move.offsetWidth;



		if(_element_teleport=='')return false;
		if(_direction=='right'){
			_element_teleport.style.left=minLeft-_element_teleport.offsetWidth+'px';
		}else{
			_element_teleport.style.left=maxLeftWidth+'px';
		}


		
	}




	Auto(){
		if(this.setting.auto==0 || !this.page_active)return false;	

		this.AutoInterval=setInterval(()=>{
			if(this.width>this.max_width && this.setting.auto_always==false)return false;
			if(this.Time()>this.time_pause){
				this.Move(this.setting.auto_move);
			}
		},this.setting.auto);
	}

	Time(){
		return new Date().getTime();
	}

	
}



