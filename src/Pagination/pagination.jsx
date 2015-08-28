'use strict';

let Pagination = React.createClass({
    propTypes: {
        // props
        listenClick:    React.PropTypes.func,
        pageShowCount:  React.PropTypes.number,
        rowCount:       React.PropTypes.number.isRequired,
        gap:            React.PropTypes.number,
        show:           React.PropTypes.string,
        showPrev:       React.PropTypes.node,
        showNext:       React.PropTypes.node,
        showFirst:      React.PropTypes.node,
        showLast:       React.PropTypes.node,
        // state
        page:           React.PropTypes.number,
    },

    getDefaultProps: function() {
        return {
            pageShowCount:  15,                         // 每頁顯示幾筆資料 (用來計算總共有多少page)
            rowCount:       0,                          // 總筆數
            gap:            5,                          // 顯示多少可點擊頁數  << < 1 2 3 4 5 > >>
            show:           'prev next page',           // 'prev next page first last'
            showPrev:       <span>&lsaquo; Prev</span>,
            showNext:       <span>Next &rsaquo;</span>,
            showFirst:      <span>&laquo;</span>,
            showLast:       <span>&raquo;</span>,
        };
    },

    getInitialState() {
        return this.getDefault(this.props);
    },

    /**
     *  當一個掛載的組件接收到新的 props 的時候被調用
     */
    componentWillReceiveProps(nextProps) {
        this.state = this.getDefault(nextProps);
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
            page: params.page ? params.page : 1,
        };
        return def;
    },

    /**
     *  檢查是否有指定字串
     *      example:
     *          "prev next page first last"
     */
    hasTag(tag) {
        if ( -1 !== this.props.show.indexOf(tag) ) {
            return true;
        }
        return false;
    },

    /**
     *  總共幾頁
     */
    getTotalPage() {
        return Math.ceil(this.props.rowCount / this.props.pageShowCount);
    },

    /**
     *  取得要顯示哪幾頁 page
     *      example:
     *          [5,6,7,8,9]
     *
     *  @return array
     */
    getShowPages() {
        let total = this.getTotalPage();
        let start, stop;
        if ( total >= this.props.gap ) {
            // 顯示 gap 的數量
            // 必須要計算 active page 在中間的位置
            start = this.state.page - Math.floor(this.props.gap/2);
            if ( start < 1 ) {
                start = 1;
            }
            stop = start + this.props.gap - 1;
            if ( stop > total ) {
                stop  = total;
                start = total - this.props.gap + 1;  // 開始的頁數要回補, 不然在尾頁的數量會少於 gap
            }
        }
        else {
            // 顯示間距若少於 gap, 那麼就都顯示
            start = 1;
            stop  = total;
        }

        let arr = new Array();
        let index = 0;
        for ( let i=start; i<=stop; i++ ) {
            arr[index++] = i;
        }
        return arr;
    },

    // --------------------------------------------------------------------------------
    // event
    // --------------------------------------------------------------------------------
    /**
     *  點擊任何有關頁數的功能
     */
    handlePage: function(p) {
        if ( p < 1 ) {
            p = 1;
        }
        else if ( p > this.getTotalPage() ) {
            p = this.getTotalPage();
        }

        // custom event
        if (this.props.listenClick) {
            this.props.listenClick(p);
        }

        this.setState({page: p});
    },

    // --------------------------------------------------------------------------------
    // render
    // --------------------------------------------------------------------------------
    render() {
        let tags = this.props.show.split(' ');
        let order = [];
        for ( let index in tags ) {
            switch (tags[index]) {
                case 'page':  order.push( this.getShowPages().map(this.renderPage) );  break;
                case 'prev':  order.push( this.renderPrev()     );  break;
                case 'next':  order.push( this.renderNext()     );  break;
                case 'first': order.push( this.renderFirst()    );  break;
                case 'last':  order.push( this.renderLast()     );  break;
            }
        }
        return (
            <ul className="pagination">{order}</ul>
        );
    },

    renderPrev: function() {
        if ( !this.hasTag('prev') ) {
            return;
        }
        if ( this.state.page === 1 ) {
            return (
                <li key="prev" className="disabled">
                    <a href="javascript:void(0)">{this.props.showPrev}</a>
                </li>
            );
        }
        return (
            <li key="prev" onClick={this.handlePage.bind(this, this.state.page-1)}>
                <a href="javascript:void(0)">{this.props.showPrev}</a>
            </li>
        );
    },

    renderNext: function() {
        if ( !this.hasTag('next') ) {
            return;
        }
        if ( this.state.page === this.getTotalPage() ) {
            return (
                <li key="next" className="disabled">
                    <a href="javascript:void(0)">{this.props.showNext}</a>
                </li>
            );
        }
        return (
            <li key="next" onClick={this.handlePage.bind(this, this.state.page+1)}>
                <a href="javascript:void(0)">{this.props.showNext}</a>
            </li>
        );
    },

    renderFirst: function() {
        if ( !this.hasTag('first') ) {
            return;
        }
        if ( this.state.page === 1 ) {
            return (
                <li key="first" className="disabled">
                    <a href="javascript:void(0)">{this.props.showFirst}</a>
                </li>
            );
        }
        return (
            <li key="first" onClick={this.handlePage.bind(this, 1)}>
                <a href="javascript:void(0)">{this.props.showFirst}</a>
            </li>
        );
    },

    renderLast: function() {
        if ( !this.hasTag('last') ) {
            return;
        }
        let total = this.getTotalPage();
        if ( this.state.page === total ) {
            return (
                <li key="last" className="disabled">
                    <a href="javascript:void(0)">{this.props.showLast}</a>
                </li>
            );
        }
        return (
            <li key="last" onClick={this.handlePage.bind(this, total)}>
                <a href="javascript:void(0)">{this.props.showLast}</a>
            </li>
        );
    },

    renderPage: function(n, i) {
        if ( !this.hasTag('page') ) {
            return;
        }
        if ( this.state.page === n ) {
            return (
                <li key={i} className="active">
                    <a href="javascript:void(0)">{n}</a>
                </li>
            );
        }
        return (
            <li key={i} onClick={this.handlePage.bind(this, n)}>
                <a href="javascript:void(0)">{n}</a>
            </li>
        );
    }

});
