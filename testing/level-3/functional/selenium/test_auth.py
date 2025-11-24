import time
import uuid
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

# Configuration
BASE_URL = "http://localhost:5173"  # Default Vite port
IMPLICIT_WAIT = 10

def setup_driver():
    """Setup Chrome driver."""
    service = Service(ChromeDriverManager().install())
    options = webdriver.ChromeOptions()
    # options.add_argument("--headless")  # Run in headless mode if needed
    driver = webdriver.Chrome(service=service, options=options)
    driver.implicitly_wait(IMPLICIT_WAIT)
    return driver

def generate_user_data():
    """Generate random user data."""
    unique_id = str(uuid.uuid4())[:8]
    return {
        "username": f"user_{unique_id}",
        "email": f"test_{unique_id}@example.com",
        "password": "Password123!",
        "confirmPassword": "Password123!"
    }

def test_registration(driver, user_data):
    """Test user registration flow."""
    print(f"Testing Registration for {user_data['username']}...")
    driver.get(f"{BASE_URL}/register")
    
    # Fill form
    driver.find_element(By.ID, "username").send_keys(user_data["username"])
    driver.find_element(By.ID, "email").send_keys(user_data["email"])
    driver.find_element(By.ID, "password").send_keys(user_data["password"])
    driver.find_element(By.ID, "confirmPassword").send_keys(user_data["confirmPassword"])
    
    # Submit
    submit_btn = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
    submit_btn.click()
    
    # Verify redirection to login or home
    try:
        WebDriverWait(driver, 10).until(EC.url_to_be(f"{BASE_URL}/"))
        print("Registration Successful: Redirected to Home")
    except Exception as e:
        print(f"Registration Failed or Timed Out. Current URL: {driver.current_url}")
        try:
            error_msg = driver.find_element(By.CLASS_NAME, "error-message").text
            print(f"Error Message on page: {error_msg}")
        except:
            print("No error message found on page.")
        raise e

def test_login(driver, user_data):
    """Test user login flow."""
    # First logout if needed, or just go to login page. 
    # If we are at Home, we might be logged in. 
    # For this test, let's assume we want to test login explicitly.
    # We might need to logout first or clear cookies.
    driver.delete_all_cookies()
    driver.refresh()
    
    print(f"Testing Login for {user_data['email']}...")
    driver.get(f"{BASE_URL}/login")
    
    # Fill form
    driver.find_element(By.ID, "username").send_keys(user_data["username"]) # React code uses username for login field name="username"
    driver.find_element(By.ID, "password").send_keys(user_data["password"])
    
    # Submit
    submit_btn = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
    submit_btn.click()
    
    # Verify redirection to home
    WebDriverWait(driver, 10).until(EC.url_to_be(f"{BASE_URL}/"))
    print("Login Successful: Redirected to Home")

def main():
    driver = setup_driver()
    try:
        user_data = generate_user_data()
        
        # Test Registration
        test_registration(driver, user_data)
        
        # Test Login
        test_login(driver, user_data)
        
        print("All tests passed!")
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Test Failed: {e}")
    finally:
        time.sleep(2) # Keep browser open briefly to see result
        driver.quit()

if __name__ == "__main__":
    main()
