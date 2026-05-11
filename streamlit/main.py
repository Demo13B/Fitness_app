import requests
import streamlit as st
from datetime import date

st.set_page_config(page_title="FitControl Demo",
                   page_icon="🏋️", layout="centered")

DEFAULT_API_URL = "http://localhost:8080"


def api_post(base_url: str, path: str, payload: dict):
    url = base_url.rstrip("/") + path
    try:
        return requests.post(url, json=payload, timeout=10)
    except requests.RequestException as e:
        return None, str(e)


def init_state():
    if "auth" not in st.session_state:
        st.session_state.auth = False
    if "token" not in st.session_state:
        st.session_state.token = ""
    if "user" not in st.session_state:
        st.session_state.user = None
    if "api_url" not in st.session_state:
        st.session_state.api_url = DEFAULT_API_URL


def logout():
    st.session_state.auth = False
    st.session_state.token = ""
    st.session_state.user = None


def auth_page():
    st.title("FitControl")

    api_url = st.session_state.api_url

    tab_reg, tab_login = st.tabs(["Регистрация", "Вход"])

    with tab_reg:
        options = {
            'Мужчина': 'male',
            'Женщина': 'female'
        }

        with st.form("register_form", clear_on_submit=False):
            username = st.text_input("Логин")
            password = st.text_input("Пароль", type="password")
            email = st.text_input("Email")
            gender = st.selectbox('Пол', ['Мужчина', 'Женщина'])
            height = st.number_input('Рост')
            weight = st.number_input('Вес')
            birth_date = st.date_input('Дата рождения', min_value=date(
                1900, 1, 1), max_value=date.today())
            medical_data = st.text_input(
                'Медицинские данные (Хронические заболевания, противопоказания)', value='Противопоказания отсутствуют')
            submit = st.form_submit_button("Зарегистрироваться")

        if submit:
            payload = {
                "username": username,
                "email": email,
                "password": password,
                "gender": options[gender],
                "height": height,
                'weight': weight,
                'birth_date': birth_date.isoformat(),
                'medical_record': medical_data
            }
            response = None
            try:
                response = requests.post(
                    api_url.rstrip("/") + "/auth/register",
                    json=payload,
                    timeout=10,
                )
            except requests.RequestException as e:
                st.error(f"Ошибка соединения: {e}")
                return

            if response.status_code in (200, 201):
                st.success("Регистрация успешна.")
            else:
                st.error(f"Ошибка регистрации: {response.status_code}")
                st.code(response.text)

    with tab_login:
        with st.form("login_form", clear_on_submit=False):
            username = st.text_input("Логин", key="login_username")
            password = st.text_input(
                "Пароль", type="password", key="login_password")
            submit = st.form_submit_button("Войти")

        if submit:
            payload = {
                "username": username,
                "password": password,
            }
            try:
                response = requests.post(
                    api_url.rstrip("/") + "/auth/login",
                    json=payload,
                    timeout=10,
                )
            except requests.RequestException as e:
                st.error(f"Ошибка соединения: {e}")
                return

            if response.status_code in (200, 201):
                data = response.json() if response.content else {}
                st.session_state.auth = True
                st.session_state.token = data.get("access_token", "")
                st.session_state.user = data.get(
                    "user", {"username": username})
                st.success("Вход выполнен.")
                st.rerun()
            else:
                st.error(f"Ошибка входа: {response.status_code}")
                st.code(response.text)


def main_page():
    st.title("Главная")
    st.write("Заглушка главной страницы после входа.")

    if st.session_state.user:
        st.info(
            f"Пользователь: {st.session_state.user.get('username', 'unknown')}")

    if st.button("Выйти"):
        logout()
        st.rerun()


def main():
    init_state()

    if st.session_state.auth:
        main_page()
    else:
        auth_page()


if __name__ == "__main__":
    main()
