const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: "lkz2mlhiqx2q",
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: "pnnHBIR0sePphnO9bxYS_lYP53oHo85QzFKZ0QM9h64"
});
async function gg (){
  let i = await client.getEntries({ content_type: "maths"});
  console.log(i.items[0.].fields.mathsquiz);
}
// State Handler
gg()

const State = (() => {
  const data = {
    questions: [[]],
    // questions: [['what is the capital of Nigeriaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa?','Abuja', 'Kano', 'Ogun', 'Lagos'], ['what is the capital of Lagos?','Ikeja', 'Agege', 'Mushin', 'Lagos Island'], ['Who is the president of Nigeria?','Muhammadu Buhari', 'Bukola Saraki', 'Yemi Osibanjo', 'Ebele Jonathan'],['Who is the president of U.S.A?','Donald Trump', 'Gladin Putin', 'Kim Joon Hung', 'Ebele Jonathan']],
    currentQuestionPosition: 0,
    score: 0,
    questionPosition: 0,
    correctAnswers: [],
    // correctAnswers: ['Abuja','Ikeja','Muhammadu Buhari','Donald Trump'],
    answer: []
  };

  return {
    fillRandQuestions: (arr) => {
      data.questions = arr
    },
    fillCorrectAnswers: (arr) => {
      data.correctAnswers = arr
    },
    populateAnswer: () => {
      for (let i = 0; i < data.questions.length; i++){
        data.answer.push(null);
      }
    },
    calculatePercentage: () => {
      let result = 0;
      data.answer.forEach(each => {
        if (each != null){
          result += 1;
        }
      });
      let perc = (result/data.questions.length) *  100;
      return perc.toFixed(0);
    },
    getPosition: () => {
      return data.questionPosition;
    },
    getData: () => {
      return data;
    },
    getQuestions: () => {
      return data.questions;
    },
    setCurrentQuestion: () => {

    },
    pushAnswer: () => {
      Array.from(document.querySelectorAll('.choice')).forEach((each) => {
        if (each.checked){
          data.answer.splice(data.questionPosition,1,each.getAttribute('value'));
          return false;
        }
      });
      
    },
    loadIndividualQuestion: () => {

    },
    editCurrentAnswer: () => {

    }
  };
})();

// User interface handler

const UiCtr = (() => {
  const uiElements = {
    percentValue: document.querySelector('.percent-completed'),
    form: document.querySelector('.option-form'),
    indicator: document.querySelector('.indicator'),
    timeValue: document.querySelector('.time-value'),
    questionNumber: document.querySelector('.question-number'),
    totalQuestions: document.querySelector('.total-questions'),
    question: document.querySelector('.quiz-question'),
    radio1: document.querySelector('#option1'),
    radio2: document.querySelector('#option2'),
    radio3: document.querySelector('#option3'),
    radio4: document.querySelector('#option4'),
    option1: document.querySelector('.option1'),
    option2: document.querySelector('.option2'),
    option3: document.querySelector('.option3'),
    option4: document.querySelector('.option4'),
    prevButton: document.querySelector('.prev'),
    nextButton: document.querySelector('.next'),
    submit: document.querySelector('.submit-answers')
  };
  return {
    showScore: (e) => {
      let h;
      e >= 4 ? h = '<h3 class="correction-title">Answer to failed questions</h3>' : h = '';
      let html = 
      `
      <section class="section3">
        <div class="container">
          <div class="result-container">
            <h2 class="thank-you">
              Thank You For Participating In Our Aptitude Test Session
            </h2>
            <p class="score-paragraph">You scored <span class="result-value"></span>%</p>
            <button class="reset">Restart Test</button>
            </br>
            </br>
            <a href="./index.html" class="reset">Return to Homepage</a>
            </br>
            ${h}
            <div class="correction-div">
             
            </div>
          </div>
          
        </div>
      </section>
      `
      document.querySelector('.section1').remove();
      document.querySelector('.section2').remove();
      document.body.insertAdjacentHTML('beforeend', html);
      document.querySelector('.reset').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.reload();
      })
    },
    unCheckOptions:() => {
      Array.from(document.querySelectorAll('.choice')).forEach((each) => {
        each.checked = false;
      });
    },
    displayQuestion: () => {
      const [q,...options] = State.getQuestions()[State.getPosition()];
      let labels = Array.from(document.querySelectorAll('.option'));
      uiElements.question.textContent = q;
      Array.from(document.querySelectorAll('.choice')).forEach((each, index) => {
        each.setAttribute('value', `${options[index]}`);
        labels[index].textContent = options[index];
      });
      if (State.getData().answer[State.getPosition()] != null){
        Array.from(document.querySelectorAll('.choice')).forEach(each => {
          if (each.getAttribute('value') === State.getData().answer[State.getPosition()]){
            each.checked = true;

          }
        });
      }
      
    },
    updateOptions: () => {

    },
    showQuestionLength: () => {
      return State.getQuestions().length;
    },
    showTime: (seconds) => {
      let minLeft = Math.floor(seconds / 60);
      let secondsLeft = seconds % 60;
      const output = `${minLeft < 10 ? '0': ''}${minLeft} : ${secondsLeft < 10 ? '0': ''}${secondsLeft}`;
      uiElements.timeValue.textContent = output;
    },
    getUiElements: () => {
      return uiElements;
    }
  };
})();

// quiz timer handler
const TimeCtr = (() => {
  
  return {
    startTimer: (minutes) => {
    let begin = minutes * 60;
    UiCtr.showTime(begin);
    let timeInSec;
    const startTime = Date.now();
    let endTimeMs = minutes * 60 * 1000;
    
    let endTime = startTime + endTimeMs;
    
    let timeHandler = setInterval(() => {
      timeInSec = Math.round((endTime - Date.now()) / 1000);
      let det = document.querySelector('.section1');
      if (timeInSec <= 0 && det){
        clearInterval(timeHandler);
        App.endQuiz();
        return;
      } else if (timeInSec == 0){
        clearInterval(timeHandler);
      }
      UiCtr.showTime(timeInSec);
    },1000);
    }
  };
})();

// App interface 

const App = (() => {
  function loadEventListeners(){
    document.addEventListener('DOMContentLoaded', showQuestion);
    UiCtr.getUiElements().nextButton.addEventListener('click', showNextQuestion);
    UiCtr.getUiElements().prevButton.addEventListener('click', showPrevQuestion);
    UiCtr.getUiElements().form.addEventListener('change', saveAnswer);
    UiCtr.getUiElements().submit.addEventListener('click', estimateScore)
  }


  function estimateScore(e){
    let res;
    let html = '';
    let wrong = [];
    State.getData().answer.forEach((each, index) => {
      if (each != null){
        if (each == State.getData().correctAnswers[index]){
          State.getData().score++;
        }
      }
    });
    res = State.getData().score;
    let scoreperc = (res/State.getData().questions.length) *  100;
    scoreperc = scoreperc.toFixed(0);
    UiCtr.showScore(scoreperc);
    document.querySelector('.result-value').textContent = `${scoreperc}`;
    
    document.querySelector('.submit-answers').style.display = 'none';

    State.getData().answer.forEach((each, index) => {
      if (each = null || each != State.getData().correctAnswers[index]){
        wrong.push(index)
      }
    });
    if (wrong){
      if (scoreperc >= 4){
        wrong.forEach(each => {
          let t = State.getQuestions();
          let h = t[each][0]
          let a = State.getData().correctAnswers[each];
          console.log(h,a)
  
          html +=  
          `
          <h3 class="correction-header">${h}</h3>
          <p class="correction-answer">Answer: ${a}</p>
          `
        });
  
        document.querySelector('.correction-div').innerHTML = html;
      }
      
    }

    e.preventDefault();
  }

// save answer and update percentage
  function saveAnswer(e){
    if (e.target.className === 'choice'){
      State.pushAnswer();
      UiCtr.getUiElements().percentValue.textContent = `${State.calculatePercentage()}%`;
      UiCtr.getUiElements().indicator.style.width = `${(State.calculatePercentage())}%`;
      // console.log(State.getData().answer);
    }
    
  }
// show first question, pre-fill answer array and update initial percentage 
  function showQuestion() {
    beforeAnything()
    .then(() => {
      State.populateAnswer();
      UiCtr.displayQuestion();
      UiCtr.getUiElements().questionNumber.textContent = State.getPosition() + 1;
      UiCtr.getUiElements().percentValue.textContent = `${State.calculatePercentage()}%`;
      UiCtr.getUiElements().indicator.style.width = `${(State.calculatePercentage())}%`;
      TimeCtr.startTimer(7);

    })
    
  }
// show next question
  function showNextQuestion(e) {
    if (State.getPosition() === State.getQuestions().length - 1){
      
      UiCtr.getUiElements().percentValue.textContent = `${State.calculatePercentage()}%`;
      UiCtr.getUiElements().indicator.style.width = `${(State.calculatePercentage())}%`;
      
      return false
    }
    State.pushAnswer();
    
    UiCtr.unCheckOptions()
    State.getData().questionPosition++;
    UiCtr.getUiElements().questionNumber.textContent = State.getPosition() + 1;
    UiCtr.displayQuestion();
    
    
    e.preventDefault();
  }

  const genRandNum = () => {
    return Math.floor((Math.random() * 150) + 1)
  }
  
  const checkArray = (arr,val) => {
    return arr.includes(val)
  }
  
  const createTenRandNum = () => {
    let ten = [];
    for (let i = 1; i <= 30; i++){
      let rand = genRandNum()
      while (checkArray(ten,rand)){
        rand = genRandNum()
      }
      ten.push(rand)
  
    }
    return ten;
  }
  
  const getRandQuestions = (arr) => {
    const val = createTenRandNum();
    
    let randq = [];
    for (i of val){
      
      randq.push(arr[i-1])
    }
    return randq
  }
  
  // const getAndPopAns = (arr) => {
  //   let ansArr = [];
  //   for (let i = 0; i < arr.length; i++){
  //     let len = arr[i].length - 1;
  //     ansArr.push(arr[i][len].toLowerCase())
  //   } 
  // return ansArr;
  // }

  function redArrandSliceAns(arr){
    let ans = [];
    let redarr = arr.map(each => {
      const q = each.splice(0,each.length -1);
      let an = each.splice(each.length -1);
      an = an.join('')
      ans.push(an);
      return q;
    }) 
    ;
    return {redarr,ans}
  }


  async function beforeAnything() {
  //   let i = await client.getEntries({ content_type: "maths"});
  // i.items[0.].fields.mathsquiz
    let  q = await client.getEntries({ content_type: "maths"});
    let p = q.items[0].fields.mathsquiz;
    // let  q = await fetch('maths.json')
    // let p = await q.json();
    
    let randq = getRandQuestions(p);
    let an = redArrandSliceAns(randq);
    // console.log(an.ans, an.redarr)
    State.fillRandQuestions(an.redarr);
    State.fillCorrectAnswers(an.ans)
    UiCtr.getUiElements().totalQuestions.textContent = UiCtr.showQuestionLength();

  }
// show previous question
  function showPrevQuestion(e) {
    if (State.getPosition() === 0){
      State.pushAnswer();
      UiCtr.getUiElements().percentValue.textContent = `${State.calculatePercentage()}%`;
      UiCtr.getUiElements().indicator.style.width = `${(State.calculatePercentage())}%`;
      return false
    }
    UiCtr.unCheckOptions()
    State.getData().questionPosition--;
    UiCtr.getUiElements().questionNumber.textContent = State.getPosition() + 1;
    UiCtr.displayQuestion();
    e.preventDefault();
  }

  return {
    init: () => {
      
      // TimeCtr.startTimer(0.5);
      loadEventListeners();
      // UiCtr.getUiElements().totalQuestions.textContent = UiCtr.showQuestionLength();
      
      UiCtr.unCheckOptions();
      
      
    },
    endQuiz: () => {
      let res;
      State.getData().answer.forEach((each, index) => {
      if (each != null){
        if (each.toLowerCase() == State.getData().correctAnswers[index].toLowerCase()){
          State.getData().score++;
        }
      }
      });
      res = State.getData().score;
      let scoreperc = (res/State.getData().questions.length) *  100;
      scoreperc = scoreperc.toFixed(0);
      UiCtr.showScore();
      document.querySelector('.result-value').textContent = `${scoreperc}`;
      
      document.querySelector('.submit-answers').style.display = 'none';
        
    }
  };
})();

App.init();

