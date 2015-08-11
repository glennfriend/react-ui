'use strict';

/**
 *  InputDate
 *
 *      params:
 *          
 *
 *      code:
 *          <InputDate name="birthDate" />
 *
 */
let InputDate = React.createClass({

    getInitialState() {
        return {
            'name': this.props.name,
            'combobox': {
                'actionName': this.props.name,
                'width': '',
                'options': [],
            },
        };
    },

    // --------------------------------------------------------------------------------
    // helper
    // --------------------------------------------------------------------------------

    /**
     *  每次 "新" 產生的元件, unique id 將會不同
     */
    uniqueId: null,
    getUniqueId(prefix) {
        if ( !this.uniqueId ) {
            let s4 = function() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            this.uniqueId = s4()+s4()+'-'+s4()+s4();
        }
        return prefix + this.uniqueId;
    },

    // --------------------------------------------------------------------------------
    // event
    // --------------------------------------------------------------------------------
    handleKey: function(event) {
        //console.log(event.type, event.keyCode, event.which, event.timeStamp, event.target.value);

        // update combobox width
        let $inputBox = $('input[name="'+ this.props.name +'"]');
        this.state.combobox.width = $inputBox.css('width');

        // 輸入 8 個數字時
        if( event.target.value.length == 8 && -1 === event.target.value.indexOf('-') ) {

            let result = event.target.value.substr(0,4)
                       + '-'
                       + event.target.value.substr(4,2)
                       + '-'
                       + event.target.value.substr(6,2)

            this.state.combobox.options = [
                [result,result]
            ];

            // update state
            this.setState({'combobox': this.state.combobox});
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
            let combobox = this.state.combobox;
            combobox.options = options;

            // update state
            this.setState({'combobox': combobox});
        }
        else {
            this.state.combobox.options = [];
            this.setState({'combobox': this.state.combobox});
        }

    },

    // --------------------------------------------------------------------------------
    // render
    // --------------------------------------------------------------------------------
    render() {
        return (
            <span>
                <input type="text" name={this.props.name} className="" onKeyUp={this.handleKey} maxLength="10" placeholder="yyyy-mm-dd" />
                <ComboBox data={this.state.combobox} />
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
            'actionName': '',
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
    uniqueId: null,
    getUniqueId(prefix) {
        if ( !this.uniqueId ) {
            let s4 = function() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            this.uniqueId = s4()+s4()+'-'+s4()+s4();
        }
        return prefix + this.uniqueId;
    },

    // --------------------------------------------------------------------------------
    // event
    // --------------------------------------------------------------------------------
    handSelect: function(event) {
        // console.log( event.target.value );
        let $inputBox = $('input[name="'+ this.state.actionName +'"]');
        
        // TODO: 這應該是錯誤的寫法!! 請更正!!
        $inputBox.val( event.target.value );
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
            <select multiple style={selectStyle} size={selectSize} onChange={this.handSelect}>
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

