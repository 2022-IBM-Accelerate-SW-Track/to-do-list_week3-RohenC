import { render, screen, fireEvent} from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

//the above 2 will execute before and after every test we run
//not exactly sure what is does though


//basic functionality test
test('test that App component renders Task', () => {
    render(<App />);
    const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
    const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
    const element = screen.getByRole('button', {name: /Add/i});
    const dueDate = "10/30/2023";
    fireEvent.change(inputTask, { target: { value: "History Test"}});
    fireEvent.change(inputDate, { target: { value: dueDate}});
    fireEvent.click(element);
    const check = screen.getByText(/History Test/i);
    const checkDate = screen.getByText(new RegExp(dueDate, "i"));
    expect(check).toBeInTheDocument();
    expect(checkDate).toBeInTheDocument();
});

//so for this one ig we just input 2 tasks with the same name and expect the second not to be
//could use getAllBy and only expect the length to = 1
test('test that App component doesn\'t render dupicate Task', () => {
    render(<App />);
    const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
    const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
    const buttonEl = screen.getByRole('button', {name: /Add/i});
    const dueDate = "10/30/2023";
    fireEvent.change(inputTask, { target: { value: "duplicate"}});
    fireEvent.change(inputDate, { target: { value: dueDate}});
    fireEvent.click(buttonEl);
    
    //now repeat cause it's a duplicate
    fireEvent.change(inputTask, { target: { value: "duplicate"}});
    fireEvent.change(inputDate, { target: { value: dueDate}});
    fireEvent.click(buttonEl);

    //if we getAllBy it should only be of length 1
    const duplicates = screen.getAllByText(/duplicate/i);
    expect(duplicates.length).toBe(1);

    //and we should expect to see it here
    const check = screen.getByText(/duplicate/i);
    const checkDate = screen.getByText(new RegExp(dueDate, "i"));
    expect(check).toBeInTheDocument();
    expect(checkDate).toBeInTheDocument();
});

test('test that App component doesn\'t add a task without task name', () => {
    render(<App />);
    //so go through the same process but never input a name
    const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
    const element = screen.getByRole('button', {name: /Add/i});
    const dueDate = "10/30/2023";
    fireEvent.change(inputDate, { target: { value: dueDate}});
    fireEvent.click(element);
    
    //after clicking add nothing should be there 

    const check = screen.getByText(/you have no todo's left/i);
    expect(check).toBeInTheDocument();
});

test('test that App component doesn\'t add a task without due date', () => {
    render(<App />);
    //similar process for date
    const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
    const element = screen.getByRole('button', {name: /Add/i});
    fireEvent.change(inputTask, { target: { value: "History Test"}});
    fireEvent.click(element);

    //nothing should have been added
    const check = screen.queryByText(/History Test/i); //being fancy with it
    expect(check).not.toBeInTheDocument();
});



test('test that App component can be deleted thru checkbox', () => {
    render(<App />);
    //so add something click the check box and see that it's deleted
    const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
    const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
    const element = screen.getByRole('button', {name: /Add/i});
    const dueDate = "10/30/2023";
    fireEvent.change(inputTask, { target: { value: "History Test"}});
    fireEvent.change(inputDate, { target: { value: dueDate}});
    fireEvent.click(element);

    //now that it's added click the checkbox
    const checkBox = screen.getByRole('checkbox');
    fireEvent.click(checkBox);

    //and now make sure the task isn't there
    const check = screen.queryByText(/History Test/i); //being fancy with it
    expect(check).not.toBeInTheDocument();
});


test('test that App component renders different colors for past due events', () => {
    render(<App />);
    //we can add one with a past due date and one with a future one and make sure the color are correct
    
    //future
    const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
    const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
    const element = screen.getByRole('button', {name: /Add/i});
    const dueDate = "10/30/2023";
    fireEvent.change(inputTask, { target: { value: "History Test"}});
    fireEvent.change(inputDate, { target: { value: dueDate}});
    fireEvent.click(element);
    
    const futureColorCheck = screen.getByTestId(/History Test/i).style.background;
    expect(futureColorCheck).toBe("rgb(255, 255, 255)");

    //past
    const oldDate = "10/30/2021";
    fireEvent.change(inputTask, { target: { value: "Math Test"}});
    fireEvent.change(inputDate, { target: { value: oldDate}});
    fireEvent.click(element);
    
    const pastColorCheck = screen.getByTestId(/Math Test/i).style.background;
    expect(pastColorCheck).toBe("rgb(255, 165, 145)");
});
