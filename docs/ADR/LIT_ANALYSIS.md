
# Lit Analysis 11/05/2025

Lit is a lightweight javascript library with some basic reactive components. 

For a project as simple as this one, building it out without Lit is easily achievable.

After looking into Lit, however, I feel like it is a healthy option for a project like this because it eases building out reactivity without adding a ton of complexity or complex new syntax like React. I decided to keep Lit and instead clean up the way we use Lit components here.

### Refactoring changes

- Had to change objects to use unsafeCss instead of css to comply with Lit's syntax and get from a global stylesheet instead of doing it component by component.