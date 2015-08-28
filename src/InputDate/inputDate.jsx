'use strict';

/**
 *  InputDate
 *
 *      params:
 *
 *      code:
 *          <InputDate name="birthDate" />
 *
 */
let InputDate = React.createClass({

    // TODO: 請分離 state & props
    getInitialState() {
        return {
            'name': this.props.name,
            'combobox': {
                'width': '',
                'options': [],
            },
        };
    },

    // --------------------------------------------------------------------------------
    // helper
    // --------------------------------------------------------------------------------
    getElementWidth() {
        let dom = React.findDOMNode(this.refs.container);
        return dom.offsetWidth;
    },

    setElementValue(value) {
        let dom = React.findDOMNode(this.refs.container);
        dom.value = value;
    },

    getElementValue() {
        let dom = React.findDOMNode(this.refs.container);
        return dom.value;
    },

    /**
     *  驗証日期格式 yyyy-mm-dd
     */
    isValidDate(date) {
        var matches = /^(\d{4})[-\/](\d{2})[-\/](\d{2})$/.exec(date);
        if (matches == null) {
            return false;
        }
        var d = matches[3];
        var m = matches[2] - 1;
        var y = matches[1];
        var composedDate = new Date(y, m, d);
        return composedDate.getDate() == d &&
               composedDate.getMonth() == m &&
               composedDate.getFullYear() == y;
    },

    /**
     *  為日期 加 one day
     */
    getDatePlus(originDate, numDay) {
        var numDay = numDay || 1;

        let matches = /^(\d{4})[-\/](\d{2})[-\/](\d{2})$/.exec(originDate);
        if (matches == null) {
            return false;
        }

        let date = new Date(originDate);
        date.setDate( date.getDate() + numDay );

        let month = (date.getMonth()+1).toString();
        if ( month.length==1 ) {
            month = '0' + month;
        }
        let day = date.getDate().toString();
        if ( day.length==1 ) {
            day = '0' + day;
        }

        return date.getFullYear() + '-' + month + '-' + day;
    },

    /**
     *  為日期 減 one day
     */
    getDateMinus(date) {
        return this.getDatePlus(date, -1);
    },

    // --------------------------------------------------------------------------------
    // event
    // --------------------------------------------------------------------------------
    handleKey: function(event) {

        // update combobox width
        this.state.combobox.width = this.getElementWidth();

        // 輸入 ↓ 的時候, 要跳到 ComboBox, 並且預選第一個項目
        if ( event.keyCode == 40 && this.state.combobox.options.length > 0 ) {
            React.findDOMNode(this.refs.box).focus();
            React.findDOMNode(this.refs.box).selectedIndex = 0;
        }
        // 輸入 8 個數字時, 直接完成 yyyy-mm-dd 的格式設定
        else if( event.target.value.length == 8 && -1 === event.target.value.indexOf('-') ) {

            let result = '';
            let guess = parseInt(event.target.value.substr(0,2));
            if ( guess >= 19 ) {
                // guess yyyymmdd
                result = event.target.value.substr(0,4)
                       + '-'
                       + event.target.value.substr(4,2)
                       + '-'
                       + event.target.value.substr(6,2)
            }
            else {
                // guess mmddyyyy
                result = event.target.value.substr(4,4)
                       + '-'
                       + event.target.value.substr(0,2)
                       + '-'
                       + event.target.value.substr(2,2)
            }
            this.setElementValue(result);
        }
        // 輸入英文字 的時候
        else if( event.target.value.match(/[a-z]/ig) ) {
            let date    = new Date();
            let yyyy    = date.getFullYear().toString();
            let mm      = (date.getMonth()+1).toString();
            let dd      = date.getDate().toString();
            let format  = yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
            let options = [
                [format, format + ' (today)'],
            ];

            // update combobox options
            this.state.combobox.options = options;

            // update state
            this.setState({'combobox': this.state.combobox});
        }
        // 當日期完整時, 輸入 ↑ 表示加日期
        else if ( event.keyCode == 38) {
            let value = this.getElementValue();
            if ( !this.isValidDate(value) ) {
                return;
            }
            this.setElementValue( this.getDatePlus(value) );

            //  游標位置
            // event.stopPropagation()
            // event.preventDefault();
            // console.log(event.target.selectionStart);
        }
        // 當日期完整時, 輸入 ↓ 表示減日期
        else if ( event.keyCode == 40) {
            let value = this.getElementValue();
            if ( !this.isValidDate(value) ) {
                return;
            }
            this.setElementValue( this.getDateMinus(value) );
        }
        else {
            this.state.combobox.options = [];
            this.setState({'combobox': this.state.combobox});
        }

    },

    /**
     *  comboBox 選取之後觸發的 event
     */
    handleChoose(value) {
        this.setElementValue(value);
    },

    // --------------------------------------------------------------------------------
    // render
    // --------------------------------------------------------------------------------
    render() {
        return (
            <span>
                <input type="text" name={this.props.name} ref="container" onKeyUp={this.handleKey} maxLength="10" placeholder="yyyy-mm-dd" />
                <ComboBox data={this.state.combobox} listenChoose={this.handleChoose} ref="box" />
            </span>
        );
    },

});





let ComboBox = React.createClass({

    getInitialState() {
        return this.getDefault( this.props.data );
    },

    /**
     *  當一個掛載的組件接收到新的 props 的時候被調用
     */
    componentWillReceiveProps(nextProps) {
        this.state = this.getDefault( nextProps.data );
    },

    // --------------------------------------------------------------------------------
    // helper
    // --------------------------------------------------------------------------------
    /**
     *  取得預設值
     *  如果參數中有相同的 key, 則覆蓋該值
     */
    getDefault(params) {
        let def = {
            'width': '',
            'maxOption': 5,
            'options': [],
        };
        for (let key in def) {
            if( typeof(params[key])!=="undefined" ) {
                def[key] = params[key];
            }
        }
        return def;
    },

    /**
     *  每次 "新" 產生的元件, unique id 將會不同
     */
    uniqueId: utils.getUniqueId(),

    getUniqueId(prefix) {
        return prefix + this.uniqueId;
    },

    // --------------------------------------------------------------------------------
    // event
    // --------------------------------------------------------------------------------
    handKey: function(event) {
        // console.log(event.type, event.keyCode, event.which, event.timeStamp, event.target.value);
        let ENTER_KEY = 13;

        if ( event.keyCode == ENTER_KEY ) {
            this.props.listenChoose(event.target.value);
            this.setState({options:[]});
        }
    },

    handClick: function(event) {
        this.props.listenChoose(event.target.value);
        this.setState({options:[]});
    },

    // --------------------------------------------------------------------------------
    // render
    // --------------------------------------------------------------------------------
    render() {
        let id          = this.getUniqueId('combobox-id-');
        let options     = this.state.options;
        let selectSize  = (options.length > this.state.maxOption ? this.state.maxOption : options.length);

        let selectStyle = {};
        selectStyle['overflow'] = 'hidden';
        selectStyle['display']  = 'none';
        if ( options.length > 0 ) {
            selectStyle['display'] = 'block';
        }

        if ( this.state.width ) {
            selectStyle['width'] = this.state.width;
        }

        return (
            <select style={selectStyle} size={selectSize} onKeyUp={this.handKey} onClick={this.handClick}>
                {options.map(this.renderOption)}
            </select>
        );
    },

    renderOption(arr, index) {
        let value = arr[0];
        let show  = arr[1];
        return (
            <option key={index} value={value}>{show}</option>
        );
    },

});

