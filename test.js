const genRandNum = () => {
  return Math.floor((Math.random() * 4) + 1)
}

const checkArray = (arr,val) => {
  return arr.includes(val)
}

const createTenRandNum = () => {
  let ten = [];
  for (let i = 1; i <= 4; i++){
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
  // console.log(arr)
  let randq = [];
  for (i of val){
    // console.log(i)
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
    const an = each.splice(each.length -1);
    ans.push(an);
    return q;
  }) 
  return {redarr,ans}
}



let tet = [["What is the capital of Nigeria?","Lagos", "Kano", "Abuja", "Ogun", "Abuja"], ["What is the capital of Lagos?","Lagos island", "ikeja", "Agege", "Mushin", "Ikeja"], ["Who is the president of Nigeria?","Ebele Jonathan", "Muhammadu Buhari", "Bukola Saraki", "Yemi Osibanjo", "Muhammadu Buhari"],["Who is the president of U.S.A?","Ebele Jonathan", "Gladin Putin", "Kim Joon Hung", "Donald Trump", "Donald Trump"]];


let qu = getRandQuestions(tet);
redArrandSliceAns(qu)

// let an = getAndPopAns(qu)
// console.log(qu)

