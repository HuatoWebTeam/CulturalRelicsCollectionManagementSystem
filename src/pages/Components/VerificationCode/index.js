import React, { Component } from 'react';
import PropTypes from 'prop-types';
import config from './config';
import warning from './warning';

function randomColor(min, max) {
    return `rgb(${randomNum(min, max)},${randomNum(min, max)},${randomNum(min, max)})`;
}

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// function drawLine(ctx,color,startX,startY,endX,endY) {
//     ctx.strokeStyle = color;
//     ctx.beginPath();
//     ctx.moveTo(startX, startY);
//     ctx.lineTo(endX, endY);
//     ctx.stroke();
// }

// function drawPoint (ctx,color,x,y,r,sAngle,eAngle) {
//     ctx.fillStyle = color;
//     ctx.beginPath();
//     ctx.arc(x, y, r, sAngle, eAngle);
//     ctx.fill();
// }

function switchTypeAndSetStringToArray(type,numbers,letters) {
    let txtArr = [];
    switch (type){
        case 'blend':
            txtArr = numbers.concat(letters);
            break;
        case 'number':
            txtArr = numbers;
            break;
        case 'letter':
            txtArr = letters;
            break;
        default:
            txtArr = letters;
    }
    return txtArr
}

function drawTxt(ctx,len,txtArr,width,height) {
    let newCode = '';
    for(let i = 1; i <= len; i++) {
        let txt = txtArr[randomNum(0, txtArr.length)];

        newCode += txt;

        //random font size
        ctx.font = randomNum(height/2, height) + 'px SimHei'; //随机生成字体大小

        //random font color
        ctx.fillStyle = randomColor(50, 160);
        ctx.shadowOffsetX = randomNum(-3, 3);
        ctx.shadowOffsetY = randomNum(-3, 3);
        ctx.shadowBlur = randomNum(-3, 3);
        ctx.shadowColor = "rgba(0, 0, 0, 0.3)";


        let x = width / (len+1) * i;
        let y = height / 2;
        let deg = randomNum(-30, 30);


        //set translate deg ,origin of coordinates
        ctx.translate(x, y);
        ctx.rotate(deg * Math.PI / 180);
        ctx.fillText(txt, 0, 0);


        //reset translate deg ,origin of coordinates
        ctx.rotate(-deg * Math.PI / 180);
        ctx.translate(-x, -y);
    }
    return newCode
}


function fillCxtPrototype(ctx) {
    ctx={};
    ctx.fillStyle=()=>false;
    ctx.fillRect=()=>false;
    ctx.translate=()=>false;
    ctx.rotate=()=>false;
    ctx.fillText=()=>false;
    ctx.beginPath=()=>false;
    ctx.moveTo=()=>false;
    ctx.lineTo=()=>false;
    ctx.stroke=()=>false;
    ctx.arc=()=>false;
    ctx.fill=()=>false;
}

export default class VerifyCode extends Component {
    state={
        code:''
    }
    
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        type: PropTypes.oneOf(['blend', 'number','letter']),
        numbers:PropTypes.array,
        letters:PropTypes.array,
        onChange:PropTypes.func,
        len:PropTypes.number,
        ref:PropTypes.string,
    }
    static defaultProps ={
        width:config.width,
		height:config.height,
        numbers:config.numbers,
        letters:config.letters,
        type:'blend',
        len:4,
        ref:'react_verify_code',
        onChange:()=>false
    }
    componentDidMount(){
        
        this.draw()
    }

    render(){
        console.log(this.props);
        const props = this.props;
        return(
            <div style={{display: 'inline-block'}} >
                <canvas ref={props.ref}
                        onClick={this.draw.bind(this)}
                        style={{
                            userSelect:'none',
                            verticalAlign: 'top'
                        }}

                        height={props.height}
                        width={props.width}>
                </canvas>
                <span onClick={this.draw.bind(this)} style={{color: '#3065bf', display: 'inline-block', width:'60px', height: '30px', paddingLeft: '10px', cursor: 'pointer'}} >换一张</span>
            </div>
        )
    }

    draw(){
        const {width,height,numbers,type,len,ref,onChange,letters} = this.props;
        const canvas = this.refs[ref];
        let ctx;
        if(canvas.getContext){
            ctx = canvas.getContext('2d');

            //for run test
            if(!ctx){
                fillCxtPrototype(ctx);
            }

        }else{
            warning('Can not use canvas');
            return;
        }



        ctx.textBaseline = "middle";
        ctx.fillStyle = randomColor(180, 240);
        ctx.fillRect(0, 0, width, height);


        //switch type
        let txtArr= switchTypeAndSetStringToArray(type,numbers,letters);



        //draw txt
        let newCode='';
        newCode = drawTxt(ctx,len,txtArr,width,height)


        //callback
        this.setState({
            code:newCode
        },()=>{
            onChange(newCode)
        })


        //draw line
        // for(let i = 0; i < len; i++) {
        //     drawLine(ctx,randomColor(40, 180),randomNum(0, width),randomNum(0, height),randomNum(0, width),randomNum(0, height));
        // }



        //draw point

        // for(let i = 0; i < width/len; i++) {
        //     drawPoint(ctx,randomColor(0, 255),randomNum(0, width),randomNum(0, height),1,0,2 * Math.PI)
        // }
    }
}
