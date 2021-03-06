import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './scroller.less'
class LanternSlide extends Component {
  state = {
    setting: {
      width: 600, //幻灯片的宽度
      height: 280, //幻灯片的高度
      posterWidth: 250, //幻灯片第一帧的宽度
      posterHeight: 250, //幻灯片第一帧的高度
      scale: 0.9,
      topValue: "", //这个为可变参数
      autoplay: "true",
      delay: 5000,
      verticalAlign: "middle"
    },
    itemStyle: {
      width: "",
      height: "",
      zIndex: "",
      opacity: "",
      left: "",
      top: ""
    },
    imgList: [],
    timer: null,
    width: null,
    activeNumber: 0,
    
  };

  componentWillMount() {
    this.setState({
      // setting: this.props.setting,
      imgList: this.props.list,
      width: this.props.width
    });
  }
  componentWillReceiveProps(nextProps) {
    // console.log("---prop");
    // console.log(this.state);
    const { timer } = this.state;
    clearInterval(timer);
    this.setState({ timer: null,  });
    // this.state.setting.topValue = "";
    // let renderItem = nextProps.list;
    // for(let item of renderItem) {
    //   item.key = new Date().getTime()
    // }
    this.setState(
      {
        imgList: nextProps.list,
        width: nextProps.width,
        itemStyle: {
          width: "",
          height: "",
          zIndex: "",
          opacity: "",
          left: "",
          top: ""
        }
      },
      () => {
        // console.log(this.state);
        // console.log(this.state.imgList);
        if (this.state.imgList.length !== 0) {
          this.getInit();
        }
      }
    );
  }

  render() {
    const { imgList, setting, width } = this.state;
    return (
      <div
        className="poster-main"
        ref="posterMain"
        style={{ width: width + "px", height: setting.height + "px" }}
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}
      >
        <div
          className="poster-btn poster-prev-btn"
          ref="posterBtnPrev"
          onClick={this.handleLeft}
        />
        <ul
          className="poster-list"
          ref="posterList"
          style={{ width: width + "px", height: setting.height + "px" }}
          key="lists"
        >
          {imgList.map(item => (
            <li className="poster-item" ref="posterItem" key={item.key}>
              <span className='imgName' >{item.relicsName}</span>
              <Link to={`/App/CredentialDetails/${item.key}`} >
                <img
                  src={item.relicsImgUrl}
                  alt={item.relicsName}
                  width="100%"
                />
              </Link>
            </li>
          ))}
        </ul>
        <div
          className="poster-btn poster-next-btn"
          ref="posterBtnNext"
          onClick={this.handleRight}
        />
      </div>
    );
  }

  componentDidMount() {
    if (this.state.imgList.length > 0) {
      this.getInit();
    }
  }

  getInit = () => {
    // console.log("init");
    const { setting, width } = this.state;
    var posterList = this.refs.posterList;
    // 图片的个数
    // console.log(posterList)
    var itemCount = posterList.children.length || 0;
    // 设置posterMain 的宽度，长度
    //   posterMainStyle = this.refs.posterMain.style;
    //   posterMainStyle.width = setting.width.toString() +'px';
    //   posterMainStyle.height = setting.height.toString() + 'px'
    // 设置两个按钮的style ,ref 的值不一样，
    var gap = (width - setting.posterWidth) / 2;
    this.refs.posterBtnPrev.style.width = gap.toString() + "px";
    this.refs.posterBtnPrev.style.height = setting.height;
    this.refs.posterBtnPrev.style.zIndex = Math.ceil(itemCount / 2);
    this.refs.posterBtnNext.style.width = gap.toString() + "px";
    this.refs.posterBtnNext.style.height = setting.height;
    this.refs.posterBtnNext.style.zIndex = Math.ceil(itemCount / 2);

    // 第一张图片的style
    // console.log(posterList.children[0]);
    posterList.children[0].style.left = gap + "px";
    posterList.children[0].style.zIndex = Math.floor(itemCount / 2);
    posterList.children[0].style.width = setting.posterWidth.toString() + "px";
    posterList.children[0].style.height = setting.posterHeight.toString() + "px";
    posterList.children[0].style.top = null;
    posterList.children[0].style.opacity = null;
    // 计算层级关系
    var rightLevel = Math.floor(itemCount / 2);
    var leftLevel = Math.floor(itemCount / 2);
    var leftOrder = Math.floor(itemCount / 2);

    // 左侧逆序输出设置层次
    var leftzIndex = 0;
    // 计算两边每个层级的缝隙
    var rightGap = gap / rightLevel;
    var leftGap = gap / leftLevel;
    {
      /*两边每一帧的透明度的大小*/
    }
    var rightOpacityNumber = 1;
    // var leftOpacityNumber = 1;

    {
      /*设置右面的帧*/
    }
    var rightOffsetWidth = this.state.setting.posterWidth + gap;

    for (let number in posterList.children) {
      if (!isNaN(number)) {
        // console.log(number);
        // console.log(Math.floor(itemCount / 2));
        if (number > 0 && number <= Math.floor(itemCount / 2)) {
          var scale = this.state.setting.scale;
          var rightSpace = rightGap;
          var count = 1;
          while (count < number) {
            scale *= scale;
            rightSpace += rightGap;
            count++;
          }
          var rightWidth = this.state.setting.posterWidth * scale;
          var rightHeight = this.state.setting.posterHeight * scale;
          // console.log(rightHeight);
          {
            /*设置右面帧top值*/
          }
          {
            this.setTopValue(rightHeight);
          }
          var style = posterList.children[number].style;
          style.zIndex = --rightLevel;
          style.height = rightHeight.toString() + "px";
          style.width = rightWidth.toString() + "px";

          // style.opacity = 1 / rightOpacityNumber++;
          style.opacity = 1;
          style.left = (rightSpace + rightOffsetWidth - rightWidth).toString() + "px";
          style.top = this.state.setting.topValue;
        } else if (number > 0) {
          var transformNumber = leftOrder--;
          var scale = this.state.setting.scale;
          var leftSpace = leftGap;
          var count = 1;
          while (count < transformNumber) {
            scale *= scale;
            leftSpace += leftGap;
            count++;
          }
          var leftWidth = this.state.setting.posterWidth * scale;
          var leftHeight = this.state.setting.posterHeight * scale;
          // console.log(leftHeight);
          {
            /*设置左面帧的top值*/
          }
          {
            this.setTopValue(leftHeight);
          }
          var style = posterList.children[number].style;
          style.zIndex = leftzIndex++;
          style.height = leftHeight.toString() + "px";
          style.width = leftWidth.toString() + "px";
          // style.opacity = number / itemCount;
          style.opacity = 1;
          style.left = (gap - leftSpace).toString() + "px";
          style.top = this.state.setting.topValue;
        }
      }
    }

    {
      /*设置是否自动播放*/
    }
    if (this.state.setting.autoplay === "true") {
      this.setState({
        timer: setInterval(this.handleRight, this.state.setting.delay)
      });
      // ID = setInterval(this.handleRight, this.state.setting.delay);
    }
  };
  setTopValue = heightValue => {
    {
      /*判断top值的大小*/
    }
    var verticalAlign = this.state.setting.verticalAlign;
    var verticalTop = "";
    if (verticalAlign === "top") {
      verticalTop = 0 + "px";
    } else if (verticalAlign === "middle") {
      verticalTop = (this.state.setting.height - heightValue) / 2 + "px";
    } else if (verticalAlign === "bottom") {
      verticalTop = this.state.setting.height - heightValue + "px";
    } else {
      verticalTop = (this.state.setting.height - heightValue) / 2 + "px";
    }
    // console.log(verticalTop)
    this.state.setting.topValue = verticalTop;
  };
  handleRight = () => {
    var i = 1;
    var itemsLength = this.refs.posterList.children.length;
    var bufferArray = [];
    while (--itemsLength > 0) {
      // console.log(itemsLength)
      var item1Style = this.refs.posterList.children[itemsLength].style;
      var item2Style = this.refs.posterList.children[itemsLength - 1].style;

      {
        this.moveItem(item1Style, item2Style);
      }
    }
  };
  handleLeft = () => {
    
    var i = 0;
    // console.log("---refs");
    // console.log(this.refs.posterList);
    var itemsLength = this.refs.posterList.children.length;
    var bufferArray = [];
    while (i < itemsLength - 1) {
      var item1Style = this.refs.posterList.children[i].style;
      /*这里有一个特别注意的是，变量指向的地址，直接用:
				var tempStyle = this.refs.posterList.children[i].style;
				tempStyle和item1Style指向的地址是一样的
			*/
      // var tempStyle = new Object();
      // tempStyle.zIndex = item1Style.zIndex;
      // tempStyle.width = item1Style.width;
      // tempStyle.height = item1Style.height;
      // tempStyle.opacity = item1Style.opacity;
      // tempStyle.left = item1Style.left;
      // tempStyle.top  = item1Style.top;

      var item2Style = this.refs.posterList.children[i + 1].style;
      {
        this.moveItem(item1Style, item2Style);
      }

      i++;
    }
  };

  moveItem = (item1, item2) => {
    this.state.itemStyle.zIndex = item1.zIndex;
    this.state.itemStyle.width = item1.width;
    this.state.itemStyle.height = item1.height;
    this.state.itemStyle.opacity = item1.opacity;
    this.state.itemStyle.left = item1.left;
    this.state.itemStyle.top = item1.top;

    item1.zIndex = item2.zIndex;
    item1.width = item2.width;
    item1.height = item2.height;
    item1.opacity = item2.opacity;
    item1.left = item2.left;
    item1.top = item2.top;

    item2.zIndex = this.state.itemStyle.zIndex;
    item2.width = this.state.itemStyle.width;
    item2.height = this.state.itemStyle.height;
    item2.opacity = this.state.itemStyle.opacity;
    item2.left = this.state.itemStyle.left;
    item2.top = this.state.itemStyle.top;
  };

  mouseEnter = () => {
    // console.log('mouseEnter')
    const { timer } = this.state;
    // console.log(timer)
    if (this.state.setting.autoplay === "true") {
      clearInterval(timer);
      this.setState({
        timer: null
      })
    }
  };

  mouseLeave = () => {
    // console.log('mouseLevel')
    if (this.state.setting.autoplay === "true") {
      this.setState({
        timer: setInterval(this.handleRight, this.state.setting.delay)
      });
      // ID = setInterval(this.handleRight,this.state.setting.delay)
    }
  };
  componentWillUnmount() {
    const { timer } = this.state;
    clearInterval(timer);
    this.setState({ timer: null });
  }
}

export default LanternSlide;