import { Form } from 'react-bootstrap';

const ChooseTemplate = () => {
    return(
        <>
        <div className="chooseTemplate mb-3">
            <h4>Select Template</h4>
            <Form>
                <div className="">
                    <Form.Check
                        inline
                        label="Template 1"
                        name="group1"
                        type="radio"
                        id="template1"
                    />
                    <Form.Check
                        inline
                        label="Template 2"
                        name="group1"
                        type="radio"
                        id="template2"
                    />
                </div>
            </Form>
        </div>
        </>
    )
}

export default ChooseTemplate;