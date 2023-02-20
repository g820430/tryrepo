let DifferenceMode = '0';
let ScoreUnit = '0';
let Weight = '';
let keyScoreArray = []; //分數陣列
let keyScoreArray_Unit2 = []; //儲存配分原始分數 陣列
let HeightDifferenceSetVal = '';
let StandardDeviationSetVal = '';
let AvgSetVal = '';
let ScoreWeightArray = [];

//差分機制
$('.DifferenceMode').change(function(){
  DifferenceMode = $('.DifferenceMode option:selected').val();
  ShowHideDiv(DifferenceMode,ScoreUnit);
})

//評分制
$('.ScoreUnitMode').change(function(){
  ScoreUnit = $('.ScoreUnitMode option:selected').val();
  ShowHideDiv(DifferenceMode,ScoreUnit);
})

//高低差 標準差 離均差 轉換為整數
$('.ScoreDifference,#keyWeight').change(function(){
  let value = parseInt($(this).val());
  let type = $(this).attr('name');
  let oldScore = $(this).data('score');
  console.log('oldScore=>',oldScore)
  
  $(this).val(value); 
  
  $('#showAlert').text('').html('').hide();
  
  if(type === "HeightDifference" && (value > 99 || value < 1)){
    $('#showAlert').text(`高低差範圍是1-99`).append(`<button class='btn alertBtn'>確定</button>`).show();
    $(this).val(oldScore); 
  }
  else if(type === "StandardDeviation" && (value > 49 || value < 1)){
    $('#showAlert').text(`標準差範圍是1-49`).append(`<button class='btn alertBtn'>確定</button>`).show();
    $(this).val(oldScore); 
  }
  else if(type === "Avg" && (value > 99 || value < 1)){
    $('#showAlert').text(`離均差範圍是1-99`).append(`<button class='btn alertBtn'>確定</button>`).show();
    $(this).val(oldScore); 
  }
  else $(this).data('score',value);
    
  $('.alertBtn').on('click',function(){
    $('#showAlert').hide();
  })
})

//計算btn => 計算高低差 標準差 與 平均值
$('.calculateScoreBtn').on('click',function(){
  //清空原設定值 與 陣列
  HeightDifferenceSetVal = '';
  StandardDeviationSetVal = '';
  AvgSetVal = '';
  Weight = '';
  keyScoreArray = [];
  keyScoreArray_Unit2 = [];
  ScoreWeightArray = [];
  
  //取差分設定值
  if($('input[name=HeightDifference]').val() !== '')
    HeightDifferenceSetVal = $('input[name=HeightDifference]').val()
  
  if($('input[name=StandardDeviation]').val() !== '')
    StandardDeviationSetVal = $('input[name=StandardDeviation]').val();
  
  if($('input[name=Avg]').val() !== '')
    AvgSetVal = $('input[name=Avg]').val();
  
  console.log('高低差設定值:',HeightDifferenceSetVal)
  console.log('標準差設定值:',StandardDeviationSetVal)
  console.log('離均差設定值:',AvgSetVal)

  keyScoreArray = $('#keyScoreDiv').val().split(' ').filter(val => {
    return val !== '';
  });
  
  //一般面向-配分制 => 換算為百分制   
  if(ScoreUnit === '2' && DifferenceMode !== '2'){ 
    
    Weight = $('#keyWeight').val();
    
    console.log('Weight=>',Weight)
    
    keyScoreArray.forEach(function(val,index){
      keyScoreArray_Unit2.push(val);
      val = parseFloat((parseFloat(val)/Weight*100).toFixed(10));
      keyScoreArray[index] = val;
    }); 
    
    for(let i = 0 ; i < keyScoreArray.length ; i++){
      ScoreWeightArray.push({
        Score: parseFloat(keyScoreArray[i]),
        OriginScore: parseInt(keyScoreArray_Unit2[i])
      });
    }
    console.log('ScoreWeightArray=>',ScoreWeightArray)
  }
  console.log('keyScoreArray=>',keyScoreArray);
  
  let HeightDifference = 0; //高低差
  let StandardDeviation = 0;//標準差
  let ScoreAvg = 0; //平均值
  let Total = 0;
  
  //高低差
  keyScoreArray.sort(function(a,b){
    return a - b;
  });
  HeightDifference = parseFloat(keyScoreArray[keyScoreArray.length-1]) - parseFloat(keyScoreArray[0]);
  
  //平均值 => 離均差
  keyScoreArray.forEach(function(val){
    Total += parseFloat(val);
  });
  ScoreAvg = parseFloat((Math.round(Total/keyScoreArray.length*10000000000)/10000000000).toFixed(10));
  
  //標準差
  keyScoreArray.forEach(val => {
    StandardDeviation += Math.pow((Math.abs(parseFloat(val)-ScoreAvg)),2);
  });
  StandardDeviation = parseFloat(Math.sqrt(StandardDeviation/keyScoreArray.length).toFixed(10));
  
  
  console.log('HeightDifference=>',HeightDifference);
  console.log('StandardDeviation=>',StandardDeviation)
  console.log('Total=>',Total);
  console.log('ScoreAvg=>',ScoreAvg)
  
  SetUpScoreResult(HeightDifference,ScoreAvg,StandardDeviation,keyScoreArray);  
});

//table塞值
function SetUpScoreResult(HeightDifference,ScoreAvg,StandardDeviation,keyScoreArray){
  $('#ResultArea').show();
  
  //清空Div 與 table元素
  $('#showResult td').text('').html('');
  $('#ChangeToScoreUnit1').html('');  
  
  //一般面向-配分 =>插入 換算後的分數Div
  if(ScoreUnit === '2'  && DifferenceMode !== '2'){
    $('#keyScoreDiv').val();
    $('.ChangeToScoreUnit1').show();
    
    ScoreWeightArray.forEach(function(item){      
      $('#ChangeToScoreUnit1').append(
        `<div>
          <span>原分數${item.OriginScore}，換算後:&emsp;</span>
          <span style="color:red">${item.Score}</span>
        </div>`        
      )
    });
  }
  
  //set差分類型
  if(HeightDifferenceSetVal === '')
    $('.HeightDifferenceTd').text(`高低差 (設定高低差為???)`);
  else
    $('.HeightDifferenceTd').text(`高低差 (設定高低差為 ${HeightDifferenceSetVal})`);
  
  if(StandardDeviationSetVal === '')
    $('.StandardDeviationTd').text(`標準差 (設定標準差為???)`);
  else
    $('.StandardDeviationTd').text(`標準差 (設定標準差為 ${StandardDeviationSetVal})`);
  
  if(AvgSetVal === '')
    $('.AvgTd').text(`平均值 (設定離均差為???)`);
  else
    $('.AvgTd').text(`平均值 (設定離均差為 ${AvgSetVal})`);
  
  //set差分結果
  //高低差
  if(HeightDifference >= HeightDifferenceSetVal && HeightDifferenceSetVal !== ''){

    if(ScoreUnit === '2' && DifferenceMode !== '2')
      keyScoreArray_Unit2.forEach(val => {
        $('.result1').append(`<span style='background-color: yellow'>${val} &emsp;</span>`)
      });
    else
      keyScoreArray.forEach(val => {
        $('.result1').append(`<span style='background-color: yellow'>${val} &emsp;</span>`)
      });    
  }
  else $('.result1').html(`<span>分數皆低於設定值(或未設定)</span>`)
  //標準差
  if(StandardDeviation >= StandardDeviationSetVal && StandardDeviationSetVal !== ''){
    
    if(ScoreUnit === '2' && DifferenceMode !== '2')
      keyScoreArray_Unit2.forEach(val => {
        $('.result2').append(`<span style='background-color: yellow'>${val} &emsp;</span>`);
      });
    else
      keyScoreArray.forEach(val => {
      $('.result2').append(`<span style='background-color: yellow'>${val} &emsp;</span>`);
    });
  }     
  else $('.result2').html(`<span>分數皆低於設定值(或未設定)</span>`)
  
  //離均差
  let count=0;
  let max = parseFloat((ScoreAvg+parseInt(AvgSetVal)).toFixed(10));
  let min = parseFloat((ScoreAvg-parseInt(AvgSetVal)).toFixed(10));
  
  if(AvgSetVal === '') $('.result3').html(`<span>分數皆低於設定值(或未設定)</span>`);
  else{
    if(ScoreUnit === '2' && DifferenceMode !== '2'){
      ScoreWeightArray.forEach(item => {
        if(item.Score >= max || item.Score <= min){
          $('.result3').append(`<span style='background-color: yellow'>${item.OriginScore} &emsp;</span>`);
          count ++;
        }
      });
      if(count === 0) $('.result3').html(`<span>分數皆低於設定值(或未設定)</span>`);
    }
    else{
      keyScoreArray.forEach(val => {
        if(val >= max || val <= min){
          $('.result3').append(`<span style='background-color: yellow'>${val} &emsp;</span>`);
          count ++;
        }
      });
      if(count === 0) $('.result3').html(`<span>分數皆低於設定值(或未設定)</span>`);
    }
  }
  
  //set值
  $('.value1').text(HeightDifference); //高低差
  $('.value2').text(StandardDeviation);//標準差
  $('.value3').html(`${ScoreAvg}<br>(範圍: ${min} ~ ${max})`);//平均值
}

//根據差分機制與評分制 顯示或隱藏Div
function ShowHideDiv(DifferenceMode,ScoreUnit){
  
  
  $('#WeightArea,#ScoreArea,.calculateScoreBtn,.ChangeToScoreUnit1,#ResultArea').hide();
  
  if(ScoreUnit === '0') return;  
  $('#ScoreArea,.calculateScoreBtn').show();  
  
  if(ScoreUnit === '2' && DifferenceMode !== '2') $('#WeightArea').show();   
}







