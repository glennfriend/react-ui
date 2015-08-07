<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv='Content-type' content='text/html; charset=utf-8'>
    <title>Example</title>
    <?php include '_head.htm'; ?>
  </head>
  <body>

    <?php include '_menu.htm'; ?>
    <section style="margin:20px;">
        <div id="content"></div>
    </section>

    <script type="text/jsx" src="dist/react-stargazer/pagination.js"></script>
    <script type="text/jsx">
        var Main = React.createClass({
            // --------------------------------------------------------------------------------
            // event
            // --------------------------------------------------------------------------------
            page(n) {
                console.log('click page '+n);
                //console.log( this.state.pageLimit.page );
            },

            getPageLimit() {
                return {
                    page: 1,
                    rowCount: 260,
                };
            },

            getPageLimit2() {
                // 假設是 ajax 的過程
                getData = {
                    page: 1,
                    rowCount: 30,
                };
                this.setState({pageLimit: getData});
            },

            getPageLimit3() {
                // 假設是 ajax 的過程
                getData = {
                    page: 4,
                    rowCount: 100,
                    prev: false,
                    next: false,
                };
                this.setState({pageLimit: getData});
            },

            // --------------------------------------------------------------------------------
            getInitialState() {
                return {
                    pageLimit: this.getPageLimit(),
                };
            },

            render() {
                return (
                    <ReactBootstrap.Row className='show-grid'>
                        <ReactBootstrap.Col md={2}>

                            <ReactBootstrap.Panel header='Pagination'>
                                Demo
                            </ReactBootstrap.Panel>

                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col md={10}>

                            <section>
                                <h1>Basic Example</h1>
                                <hr/>
                            </section>

                            <nav>
                                <Sg.Pagination data={this.state.pageLimit} handlePage={this.page} />
                            </nav>

                            <p>
                                <ReactBootstrap.Button bsStyle='primary' onClick={this.getPageLimit2}>
                                    ajax 2
                                </ReactBootstrap.Button>
                                &nbsp;&nbsp;

                                <ReactBootstrap.Button bsStyle='primary' onClick={this.getPageLimit3}>
                                    ajax 3
                                </ReactBootstrap.Button>
                            </p>

                        </ReactBootstrap.Col>
                    </ReactBootstrap.Row>
                );
            },
        });
        React.render(<Main />, document.getElementById('content'));
    </script>

  </body>
</html>
