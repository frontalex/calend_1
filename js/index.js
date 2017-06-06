!function() {

  var today = moment();

  function Calendar(selector, events) {
    this.el = document.querySelector(selector);
    this.events = events;
    this.current = moment().date(1);
    this.draw();
    var current = document.querySelector('.today');
    if(current) {
      var self = this;
      window.setTimeout(function() {
        self.openDay(current);
      }, 500);
    }
  }

  Calendar.prototype.draw = function() {
    //Create Header
    this.drawHeader();

    //Draw Month
    this.drawMonth();

    // this.drawLegend();
  }

  Calendar.prototype.drawHeader = function() {
    var self = this;
    if(!this.header) {
      //Create the header elements
      this.header = createElement('div', 'header');
      this.header.className = 'header';
      this.daysnames = createElement('div', 'days-names')
      this.title = createElement('h1');

      var right = createElement('div', 'right');
      right.addEventListener('click', function() { self.nextMonth(); });

      var left = createElement('div', 'left');
      left.addEventListener('click', function() { self.prevMonth(); });

      //Append the Elements
      this.header.appendChild(this.title); 
      this.header.appendChild(right);
      this.header.appendChild(left);
      this.el.appendChild(this.header);
      this.el.appendChild(this.daysnames);
    }

    this.title.innerHTML = this.current.format('MMMM YYYY');
    this.daysnames.innerHTML = "<div>пн</div><div>вт</div><div>ср</div><div>чт</div><div>пт</div><div>сб</div><div>вс</div>";
  }

  Calendar.prototype.drawMonth = function() {
    var self = this;
    
    this.events.forEach(function(ev) {
     ev.date = self.current.clone().date(Math.random() * (29 - 1) + 1);
   });
    
    
    if(this.month) {
      this.oldMonth = this.month;
      this.oldMonth.className = 'month out ' + (self.next ? 'next' : 'prev');
      this.oldMonth.addEventListener('webkitAnimationEnd', function() {
        self.oldMonth.parentNode.removeChild(self.oldMonth);
        self.month = createElement('div', 'month');
        self.backFill();
        self.currentMonth();
        self.fowardFill();
        self.el.appendChild(self.month);
        window.setTimeout(function() {
          self.month.className = 'month in ' + (self.next ? 'next' : 'prev');
        }, 16);
      });
    } else {
      this.month = createElement('div', 'month');
      this.el.appendChild(this.month);
      this.backFill();
      this.currentMonth();
      this.fowardFill();
      this.month.className = 'month new';
    }
  }

  Calendar.prototype.backFill = function() {
    var clone = this.current.clone().subtract('days', 1);
    var dayOfWeek = clone.day();

    if(!dayOfWeek) { return; }

    clone.subtract('days', dayOfWeek+0);

    for(var i = dayOfWeek; i > 0 ; i--) {
      this.drawDay(clone.add('days', 1));
    }
  }

  Calendar.prototype.fowardFill = function() {
    var clone = this.current.clone().add('months', 1).subtract('days', 1);
    var dayOfWeek = clone.day();

    if(dayOfWeek === 7) { return; }

    for(var i = dayOfWeek; i < 7 ; i++) {
      this.drawDay(clone.add('days', 1));
    }
  }

  Calendar.prototype.currentMonth = function() {
    var clone = this.current.clone();

    while(clone.month() === this.current.month()) {
      this.drawDay(clone);
      clone.add('days', 1);
    }
  }

  Calendar.prototype.getWeek = function(day) {
    if(!this.week || day.day() === 1) {
      this.week = createElement('div', 'week');
      this.month.appendChild(this.week);
    }
  }

  Calendar.prototype.drawDay = function(day) {
    var self = this;
    this.getWeek(day);

    //Outer Day
    var outer = createElement('div', this.getDayClass(day));
    outer.addEventListener('click', function() {
      self.openDay(this);
    });

    //Day Name
    // var name = createElement('div', 'day-name', day.format('ddd'));

    //Day Number
    var number = createElement('div', 'day-number', day.format('D'));


    //Events
    var events = createElement('div', 'day-events');
    this.drawEvents(day, events);

    // outer.appendChild(name);
    outer.appendChild(number);
    outer.appendChild(events);
    this.week.appendChild(outer);
  }

  Calendar.prototype.drawEvents = function(day, element) {
    if(day.month() === this.current.month()) {
      var todaysEvents = this.events.reduce(function(memo, ev) {
        if(ev.date.isSame(day, 'day')) {
          memo.push(ev);
        }
        return memo;
      }, []);

      todaysEvents.forEach(function(ev) {
        var evSpan = createElement('span', ev.color);
        element.appendChild(evSpan);
      });
    }
  }

  Calendar.prototype.getDayClass = function(day) {
    classes = ['day'];
    if(day.month() !== this.current.month()) {
      classes.push('other');
    } else if (today.isSame(day, 'day')) {
      classes.push('today');
    }
    return classes.join(' ');
  }

  Calendar.prototype.openDay = function(el) {
    var details, arrow;
    var dayNumber = +el.querySelectorAll('.day-number')[0].innerText || +el.querySelectorAll('.day-number')[0].textContent;
    var day = this.current.clone().date(dayNumber);

    var currentOpened = document.querySelector('.details');

    //Check to see if there is an open detais box on the current row
    if(currentOpened && currentOpened.parentNode === el.parentNode) {
      details = currentOpened;
      // arrow = document.querySelector('.arrow');
    } 
    else {
      //Close the open events on differnt week row
      //currentOpened && currentOpened.parentNode.removeChild(currentOpened);
      if(currentOpened) {
        // currentOpened.addEventListener('webkitAnimationEnd', function() {
        //   currentOpened.parentNode.removeChild(currentOpened);
        // });
        // currentOpened.addEventListener('oanimationend', function() {
        //   currentOpened.parentNode.removeChild(currentOpened);
        // });
        // currentOpened.addEventListener('msAnimationEnd', function() {
        //   currentOpened.parentNode.removeChild(currentOpened);
        // });
        // currentOpened.addEventListener('animationend', function() {
          currentOpened.parentNode.removeChild(currentOpened);
        // });
        currentOpened.className = 'details out';
      }

      //Create the Details Container
      details = createElement('div', 'details in');

      //Create the arrow
      var arrow = createElement('div', 'arrow');

      //Create the event wrapper

      // details.appendChild(arrow);
      this.el.appendChild(details);
      var plus = createElement('div', 'plus', '+');
      this.el.appendChild(plus);
    }

    var todaysEvents = this.events.reduce(function(memo, ev) {
      if(ev.date.isSame(day, 'day')) {
        memo.push(ev);
      }
      return memo;
    }, []);

    this.renderEvents(todaysEvents, details);

    arrow.style.left = el.offsetLeft - el.parentNode.offsetLeft + 27 + 'px';
  }

  Calendar.prototype.renderEvents = function(events, ele) {
    //Remove any events in the current details element
    var currentWrapper = ele.querySelector('.events');
    var wrapper = createElement('div', 'events in' + (currentWrapper ? ' new' : ''));
    // var date = createElement('div', '', 'Завтра в 17:00');
    // var address = createElement('div', '', 'Комсомольская 22');

    events.forEach(function(ev) {
      var div = createElement('div', 'event');
      var square = createElement('div', 'event-category ' + ev.color);
      var span = createElement('span', '', ev.eventName);
      var br = createElement('div', '');
      var edate = createElement('div', 'edate', 'Завтра в 17:00');
      var eaddress = createElement('div', 'eaddress', 'Комсомольская 22');
      br.innerHTML = "";
      div.appendChild(square);
      div.appendChild(span);
      div.appendChild(br);
      div.appendChild(edate);
      div.appendChild(eaddress);
      wrapper.appendChild(div);
      // edate.appendChild(date);
    });

    if(!events.length) {
      var div = createElement('div', 'event empty');
      var span = createElement('span', '', 'No Events');

      div.appendChild(span);
      wrapper.appendChild(div);
    }

    if(currentWrapper) {
      currentWrapper.className = 'events out';
      currentWrapper.addEventListener('webkitAnimationEnd', function() {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
      currentWrapper.addEventListener('oanimationend', function() {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
      currentWrapper.addEventListener('msAnimationEnd', function() {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
      currentWrapper.addEventListener('animationend', function() {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
    } else {
      ele.appendChild(wrapper);
    }
  }
  

  Calendar.prototype.drawLegend = function() {
    var legend = createElement('div', 'legend');
    var calendars = this.events.map(function(e) {
      return e.calendar + '|' + e.color;
    }).reduce(function(memo, e) {
      if(memo.indexOf(e) === -1) {
        memo.push(e);
      }
      return memo;
    }, []).forEach(function(e) {
      var parts = e.split('|');
      var entry = createElement('span', 'entry ' +  parts[1], parts[0]);
      legend.appendChild(entry);
    });
    this.el.appendChild(legend);
  }

  Calendar.prototype.nextMonth = function() {
    this.current.add('months', 1);
    this.next = true;
    this.draw();
  }

  Calendar.prototype.prevMonth = function() {
    this.current.subtract('months', 1);
    this.next = false;
    this.draw();
  }

  window.Calendar = Calendar;

  function createElement(tagName, className, innerText) {
    var ele = document.createElement(tagName);
    if(className) {
      ele.className = className;
    }
    if(innerText) {
      ele.innderText = ele.textContent = innerText;
    }
    return ele;
  }
}();

!function() {
  var data = [
  { eventName: 'Занятие по фехтованию', calendar: 'Work', color: 'orange' },
  { eventName: 'Тренировка по гребле', calendar: 'Work', color: 'orange' },
  { eventName: 'Футбольный матч', calendar: 'Work', color: 'orange' },
  { eventName: 'Пляжный волейбол чемпионат', calendar: 'Work', color: 'orange' },

  { eventName: 'Забег на 10 км.', calendar: 'Sports', color: 'blue' },
  { eventName: 'Марафон на 20 км.', calendar: 'Sports', color: 'blue' },
  { eventName: 'Эставета 30 км.', calendar: 'Sports', color: 'blue' },
  { eventName: 'Спринт на 5 км.', calendar: 'Sports', color: 'blue' },

  { eventName: 'Праздник 1', calendar: 'Kids', color: 'yellow' },
  { eventName: 'Праздник 2', calendar: 'Kids', color: 'yellow' },
  { eventName: 'Праздник 3', calendar: 'Kids', color: 'yellow' },
  { eventName: 'Праздник 4', calendar: 'Kids', color: 'yellow' },

  { eventName: 'Мероприятие 1', calendar: 'Other', color: 'green' },
  { eventName: 'Мероприятие 2', calendar: 'Other', color: 'green' },
  { eventName: 'Мероприятие 3', calendar: 'Other', color: 'green' },
  { eventName: 'Мероприятие 4', calendar: 'Other', color: 'green' }
  ];

  

  function addDate(ev) {

  }

  var calendar = new Calendar('#calendar', data);

}();