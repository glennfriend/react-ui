<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv='Content-type' content='text/html; charset=utf-8'>
    <title>Example</title>
    <?php include '_head.htm'; ?>
    <script>

    </script>
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
            },

            // --------------------------------------------------------------------------------
            getInitialState() {
                return {
                    pageLimit: {
                        page: 1,
                        rowCount: 266,
                    },
                };
            },

            render() {
                return (

                    <ReactBootstrap.Row className='show-grid'>
                        <ReactBootstrap.Col md={2}>

                            <ReactBootstrap.Panel header='Panel heading without title'>
                                Panel content
                            </ReactBootstrap.Panel>

                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col md={10}>

                            <section>
                                <h1>Basic Example</h1>
                                <hr/>
                                <p>example</p>
                            </section>

                            <ReactBootstrap.Button bsStyle='primary'>
                                Default
                            </ReactBootstrap.Button>
                            <br />
                            <Sg.Pagination data={this.state.pageLimit} handlePage={this.page} />
                            <br />

                        </ReactBootstrap.Col>
                    </ReactBootstrap.Row>

                );
            },
        });
        React.render(<Main />, document.getElementById('content'));
    </script>

  </body>
</html>
