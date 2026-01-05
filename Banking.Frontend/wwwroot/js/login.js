// Clean Banking Login Form JavaScript
class BankingLoginForm {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('username');
        this.passwordInput1 = document.getElementById('password1');
        this.passwordToggle1 = document.getElementById('passwordToggle1');
        this.passwordInput2 = document.getElementById('password2');
        this.passwordToggle2 = document.getElementById('passwordToggle2');

        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupPasswordToggle();
        this.setupPasswordToggle2();
    }
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        this.emailInput.addEventListener('input', () => this.clearError('username'));
        this.emailInput.addEventListener('blur', () => this.validateEmail());

        this.passwordInput1.addEventListener('input', () => this.clearError('password1'));
        this.passwordInput1.addEventListener('blur', () => this.validatePassword());

        this.passwordInput2.addEventListener('input', () => this.clearError('password2'));
        this.passwordInput2.addEventListener('blur', () => this.validatePassword2());
    }
    
    setupPasswordToggle() {
        this.passwordToggle1.addEventListener('click', () => {
            const type = this.passwordInput1.type === 'password1' ? 'text' : 'password1';
            this.passwordInput1.type = type;
            
            this.passwordToggle1.classList.toggle('show-password', type === 'text');
        });
    }
    setupPasswordToggle2() {
        this.passwordToggle2.addEventListener('click', () => {
            const type = this.passwordInput2.type === 'password2' ? 'text' : 'password2';
            this.passwordInput2.type = type;
            
            this.passwordToggle2.classList.toggle('show-password', type === 'text');
        });
    }
    
    validateEmail() {
        const username = this.emailInput.value.trim();
        
        if (!username) {
          this.showError('username', 'Username is required');
            return false;
        }
        
        this.clearError('username');
        return true;
    }
    
    validatePassword() {
        const password = this.passwordInput1.value;
        
        if (!password) {
            this.showError('password1', 'Password 1 is required');
            return false;
        }
        
        this.clearError('password1');
        return true;
    }
    validatePassword2() {
        const password2 = this.passwordInput2.value;
        
        if (!password2) {
            this.showError('password2', 'Password 2 is required');
            return false;
        }
        
        this.clearError('password2');
        return true;
    }
    
    showError(field, message) {
        const formGroup = document.getElementById(field).closest('.form-group');
        const errorElement = document.getElementById(`${field}Error`);
        
        formGroup.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    clearError(field) {
        const formGroup = document.getElementById(field).closest('.form-group');
        const errorElement = document.getElementById(`${field}Error`);
        
        formGroup.classList.remove('error');
        errorElement.classList.remove('show');
        setTimeout(() => {
            errorElement.textContent = '';
        }, 200);
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();
        const isPasswordValid2 = this.validatePassword2();
        const password1 = this.passwordInput1.value;
        const password2 = this.passwordInput2.value;
        
        if (!isEmailValid || !isPasswordValid || !isPasswordValid2) {
            return;
        }

        if (password1 != password2) {
          const errorElement = document.getElementById(`passwordMismatch`);
          errorElement.classList.add('show');
          return;
        }

        e.target.submit();
    }
}

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BankingLoginForm();
});