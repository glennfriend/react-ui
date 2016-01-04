(function () {
    'use strict';

    let Main = React.createClass({
        // --------------------------------------------------------------------------------
        // event
        // --------------------------------------------------------------------------------
        handleClick(page) {
            console.log('page '+page);
        },

        getData() {
            return {
                page: 1,
                rowCount: 150,
            };
        },

        // 假設是 ajax 的過程
        getData2() {
            // 覆蓋, 不保留原有的 state 資料
            this.state.data = {
                page: 1,
                rowCount: 46,
                show: 'page',
            };
            this.setState({data: this.state.data});
        },

        // 假設是 ajax 的過程
        getData3() {
            // 覆蓋, 不保留原有的 state 資料
            this.state.data = {
                page: 4,
                rowCount: 160,
                show: 'first prev page next last',
            };
            this.setState({data: this.state.data});

            /*
                如果不覆蓋, 要保留, 做法如下
                this.state.data.page     = 4;
                this.state.data.rowCount = 160;
                this.setState({data: this.state.data});
            */
        },

        // --------------------------------------------------------------------------------
        getInitialState() {
            return {
                data: this.getData()
            };
        },

        render() {
            return (
                <section>
                    <nav>
                        <ui.Pagination {...this.state.data} listenClick={this.handleClick} />
                    </nav>
                    <p>
                        <button className="btn btn-primary" onClick={this.getData2}>
                            ajax 2
                        </button>
                        &nbsp;&nbsp;

                        <button className="btn btn-primary" onClick={this.getData3}>
                            ajax 3
                        </button>
                    </p>
                </section>
            );
        },
    });

    ReactDOM.render(<Main />, document.getElementById('content'));

})();
