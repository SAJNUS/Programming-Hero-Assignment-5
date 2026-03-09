# GitHub Issues Tracker

## Project Overview

GitHub Issues Tracker is a responsive web application that allows users to manage and track project issues. The application provides a clean interface to view, search, and filter issues by their status. Users can click on any issue card to view detailed information in a modal popup.

## Features

- **User Authentication**: Login page with credential validation
- **Dashboard View**: Display all issues in a responsive 4-column grid layout
- **Tab Filtering**: Filter issues by All, Open, or Closed status
- **Search Functionality**: Search issues using keywords
- **Issue Details Modal**: View complete issue information in a popup
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Loading States**: Visual feedback during API requests
- **Status Indicators**: Color-coded badges for priority and status

## Technology Stack

- **HTML5**: Semantic markup for page structure
- **CSS3**: Modern styling with flexbox and grid layouts, animations
- **Vanilla JavaScript**: Pure JavaScript without frameworks
- **REST API**: Integration with backend API for data fetching

## How to Run the Project

1. Clone or download the project to your local machine
2. Open `index.html` in a web browser to access the login page
3. Enter the demo credentials to log in
4. You will be redirected to the dashboard where you can view and interact with issues

**Note**: The project uses external API calls, so an internet connection is required.

## Demo Credentials

Use these credentials to log in:

- **Username**: admin
- **Password**: admin123

---

## JavaScript Concepts

### 1. What is the difference between var, let, and const?

**var** is the old way to declare variables in JavaScript. It has function scope, which means it can be accessed anywhere within the function where it's declared. Variables declared with var can be re-declared and updated.

**let** is a modern way to declare variables that have block scope. This means the variable only exists within the curly braces {} where it's defined. You can update a let variable but cannot re-declare it in the same scope.

**const** is used to declare constants that cannot be changed after they are assigned a value. Like let, it also has block scope. You must assign a value when you declare a const variable, and you cannot reassign it later.

### 2. What is the spread operator (...)?

The spread operator (...) is used to expand or spread elements from an array or object. It's like unpacking items from a box.

For arrays, it lets you copy all elements or combine multiple arrays. For example, if you have an array of numbers, the spread operator can copy them into a new array or add them to another array.

For objects, it copies all properties from one object to another. This is useful when you want to create a copy of an object or merge multiple objects together.

### 3. What is the difference between map(), filter(), and forEach()?

**forEach()** loops through each element in an array and performs an action, but it doesn't return anything. It's used when you just want to do something with each item without creating a new array.

**map()** also loops through each element, but it creates and returns a new array with transformed values. For example, if you have an array of numbers and want to double each one, map() will give you a new array with the doubled values.

**filter()** creates a new array containing only the elements that pass a certain condition. It's like filtering out items you don't want. For example, if you have an array of numbers and only want numbers greater than 10, filter() will return a new array with just those numbers.

### 4. What is an arrow function?

An arrow function is a shorter way to write functions in JavaScript using the arrow syntax (=>). Instead of writing the word "function", you use an arrow.

For example, instead of writing `function add(a, b) { return a + b; }`, you can write `(a, b) => a + b`. This makes the code cleaner and easier to read.

Arrow functions are especially useful when passing functions as arguments or when working with array methods like map() and filter(). They also handle the "this" keyword differently than regular functions, which can be helpful in certain situations.

### 5. What are template literals?

Template literals are a way to create strings in JavaScript using backticks (`) instead of regular quotes. They make it easy to include variables and expressions directly inside the string using ${}.

For example, instead of writing `"Hello " + name + "!"`, you can write `` `Hello ${name}!` ``. This is much cleaner and easier to read.

Template literals also allow you to write multi-line strings without having to use special characters or concatenation. You can just press Enter and continue writing on the next line, and it will maintain the line breaks in the final string.
