import requests
import streamlit as st
from datetime import date, datetime

st.set_page_config(page_title="FitControl Demo",
                   page_icon="🏋️", layout="centered")

DEFAULT_API_URL = "http://localhost:8080"


def init_state():
    if "auth" not in st.session_state:
        st.session_state.auth = False
    if "user" not in st.session_state:
        st.session_state.user = None
    if "api_url" not in st.session_state:
        st.session_state.api_url = DEFAULT_API_URL
    if "profile" not in st.session_state:
        st.session_state.profile = None
    if "http" not in st.session_state:
        st.session_state.http = requests.Session()


def logout():
    st.session_state.auth = False
    st.session_state.user = None
    st.session_state.profile = None
    st.session_state.http.cookies.clear()


def safe_request(method, base_url: str, path: str, payload=None):
    url = base_url.rstrip("/") + path
    try:
        response = st.session_state.http.request(
            method=method,
            url=url,
            json=payload,
            timeout=10,
        )

        if response.status_code == 401:
            refresh = st.session_state.http.request(
                method='POST',
                url=base_url.rstrip('/') + '/auth/refresh',
                timeout=10
            )
            if refresh.status_code in (200, 201):
                return safe_request(method, base_url, path, payload)
            else:
                return refresh
        return response
    except requests.RequestException as e:
        st.error(f"Ошибка соединения: {e}")
        return None


def parse_date(value):
    if not value:
        return date.today()
    if isinstance(value, date):
        return value
    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00")).date()
    except Exception:
        try:
            return date.fromisoformat(str(value)[:10])
        except Exception:
            return date.today()


def auth_page():
    st.title("FitControl")
    api_url = st.session_state.api_url

    tab_login, tab_reg = st.tabs(["Вход", 'Регистрация'])

    with tab_reg:
        options = {
            "Мужчина": "male",
            "Женщина": "female",
        }

        with st.form("register_form", clear_on_submit=False):
            username = st.text_input("Логин")
            password = st.text_input("Пароль", type="password")
            email = st.text_input("Email")
            gender = st.selectbox("Пол", ["Мужчина", "Женщина"])
            height = st.number_input("Рост", min_value=0.0, step=1.0)
            weight = st.number_input("Вес", min_value=0.0, step=1.0)
            birth_date = st.date_input(
                "Дата рождения",
                min_value=date(1900, 1, 1),
                max_value=date.today(),
            )
            medical_data = st.text_input(
                "Медицинские данные (хронические заболевания, противопоказания)",
                value="Противопоказания отсутствуют",
            )
            submit = st.form_submit_button("Зарегистрироваться")

        if submit:
            payload = {
                "username": username,
                "email": email,
                "password": password,
                "gender": options[gender],
                "height": height,
                "weight": weight,
                "birth_date": birth_date.isoformat(),
                "medical_record": medical_data,
            }
            response = safe_request("POST", api_url, "/auth/register", payload)
            if response is not None:
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
            response = safe_request("POST", api_url, "/auth/login", payload)
            if response is not None:
                if response.status_code in (200, 201):
                    data = response.json() if response.content else {}
                    st.session_state.auth = True
                    st.session_state.user = data.get(
                        "user", {"username": username})
                    st.success("Вход выполнен.")
                    st.rerun()
                else:
                    st.error(f"Ошибка входа: {response.status_code}")
                    st.code(response.text)


def load_self_profile():
    response = safe_request("GET", st.session_state.api_url, "/users/self")
    if response is None:
        return None
    if response.status_code == 200:
        return response.json()
    st.error(f"Не удалось загрузить профиль: {response.status_code}")
    st.code(response.text)
    return None


def update_self_profile(payload):
    response = safe_request(
        "PATCH", st.session_state.api_url, "/users/self", payload)
    if response is None:
        return False
    if response.status_code in (200, 201):
        st.success("Данные обновлены.")
        try:
            st.session_state.profile = response.json()
        except Exception:
            pass
        return True
    st.error(f"Не удалось обновить данные: {response.status_code}")
    st.code(response.text)
    return False


def delete_self_profile():
    response = safe_request("DELETE", st.session_state.api_url, "/users/self")
    if response is None:
        return False
    if response.status_code in (200, 204):
        st.success("Аккаунт удалён.")
        logout()
        st.rerun()
        return True
    st.error(f"Не удалось удалить аккаунт: {response.status_code}")
    st.code(response.text)
    return False


def profile_page():
    st.session_state.profile = load_self_profile()
    profile = st.session_state.profile

    if profile:
        gender_map = {
            "male": "Мужчина",
            "female": "Женщина",
        }

        st.title("Профиль")

        c1, c2 = st.columns(2)
        c1.metric("Логин", profile.get("username", "—"))
        c2.metric("Email", profile.get("email", "—"))

        c3, c4 = st.columns(2)
        c3.metric("Пол", gender_map.get(profile.get(
            "gender"), profile.get("gender", "—")))
        c4.metric("Дата рождения", str(profile.get("birth_date", "—"))[:10])

        c5, c6 = st.columns(2)
        c5.metric("Рост", f"{profile.get('height', '—')} см")
        c6.metric("Вес", f"{profile.get('weight', '—')} кг")

        st.metric('Медицинские данные',
                  f"{profile.get('medical_record', '-')}")

        st.divider()

        st.title('Обновить данные')

        email = profile.get("email", "")
        gender = profile.get("gender", "male")
        height = profile.get("height", 0.0)
        weight = profile.get("weight", 0.0)
        birth_date = parse_date(profile.get("birth_date"))
        medical_record = profile.get("medical_record", "")

        reverse_gender_map = {
            "Мужчина": "male",
            "Женщина": "female",
        }

        with st.form("update_self_form", clear_on_submit=False):
            new_email = st.text_input("Email", value=email)
            new_gender = st.selectbox(
                "Пол",
                ["Мужчина", "Женщина"],
                index=0 if gender == "male" else 1,
            )
            new_height = st.number_input(
                "Рост",
                min_value=0.0,
                step=1.0,
                value=float(height or 0),
            )
            new_weight = st.number_input(
                "Вес",
                min_value=0.0,
                step=1.0,
                value=float(weight or 0),
            )
            new_birth_date = st.date_input(
                "Дата рождения",
                min_value=date(1900, 1, 1),
                max_value=date.today(),
                value=birth_date,
            )
            new_medical_record = st.text_input(
                "Медицинские данные",
                value=medical_record,
            )
            save = st.form_submit_button("Сохранить")

        if save:
            payload = {
                "email": new_email,
                "gender": reverse_gender_map[new_gender],
                "height": new_height,
                "weight": new_weight,
                "birth_date": new_birth_date.isoformat(),
                "medical_record": new_medical_record,
            }
            if update_self_profile(payload):
                st.rerun()

        st.divider()
        st.warning("Удаление аккаунта необратимо.")
        confirm_delete = st.checkbox("Я понимаю, что данные будут удалены")
        if st.button("Удалить мой аккаунт", disabled=not confirm_delete):
            delete_self_profile()
    else:
        st.info("Нажмите «Загрузить данные», чтобы получить профиль через /users/self.")


def assessment_page():
    st.title('Общая оценка')
    api_url = st.session_state.api_url

    tab_last, tab_overall, tab_create, tab_trend = st.tabs(
        ['Результаты последних измерений', 'Прогресс', 'Добавить запись', 'Тренд'])

    with tab_last:
        response = safe_request(
            'GET',
            st.session_state.api_url,
            f"/assessment/{st.session_state.profile['id']}"
        )
        if response is not None:
            if response.status_code in (200, 201):
                data = response.json()
                st.markdown('#### Результаты оценки')
                st.metric('BMI', f"{data['bmi']:.2f}")
                st.metric('VO2max', f"{data['vo2_max']:.2f}")
                st.metric('1RM', f"{data['rm1']:.2f}")
                st.metric('Total score', f"{data['total_score']:.2f}")
            else:
                st.error(f"Ошибка: {response.status_code}")
                st.code(response.text)

    with tab_create:
        with st.form("register_form", clear_on_submit=False):
            st.title('Физиология')
            weight = st.number_input(
                'Вес', value=st.session_state.profile['weight'])
            height = st.number_input(
                'Рост', value=st.session_state.profile['height'])
            st.divider()

            st.title('Тест Купера')
            distance = st.number_input('Пройденное расстояние')
            st.divider()

            st.title('Тест 1RM')
            st.markdown('##### Жим лежа')
            bench_weight = st.number_input('Вес', key='bench_weight')
            bench_reps = st.number_input(
                'Количество повторений', key='bench_reps')
            st.markdown('##### Становая тяга')
            deadlift_weight = st.number_input('Вес', key='deadlift_weight')
            deadlift_reps = st.number_input(
                'Количество повторений', key='deadlift_reps')
            st.markdown('##### Приседания со штангой')
            squat_weight = st.number_input('Вес', key='squats_weight')
            squat_reps = st.number_input(
                'Количество повторений', key='squats_reps')
            st.divider()

            submit = st.form_submit_button('Отправить')

            if submit:
                st.divider()
                payload = {
                    "height": height,
                    "weight": weight,
                    "cooper_distance": distance,
                    "bench_weight": bench_weight,
                    "bench_reps": bench_reps,
                    "deadlift_weight": deadlift_weight,
                    "deadlift_reps": deadlift_reps,
                    "squat_weight": squat_weight,
                    "squat_reps": squat_reps
                }
                response = safe_request(
                    "POST", api_url, f"/assessment/{st.session_state.profile['id']}", payload)
                if response is not None:
                    if response.status_code in (200, 201):
                        data = response.json()
                        st.title('Результаты оценки')
                        st.metric('BMI', f"{data['bmi']:.2f}")
                        st.metric('VO2max', f"{data['vo2_max']:.2f}")
                        st.metric('1RM', f"{data['rm1']:.2f}")
                        st.metric('Total score', f"{data['total_score']:.2f}")

                    else:
                        st.error(f"Ошибка: {response.status_code}")
                        st.code(response.text)

    with tab_overall:
        response = safe_request(
            'GET',
            st.session_state.api_url,
            f"/assessment/overall/{st.session_state.profile['id']}"
        )
        if response is not None:
            if response.status_code in (200, 201):
                overall = response.json()
            else:
                st.error(f"Ошибка: {response.status_code}")
                st.code(response.text)

        response = safe_request(
            'GET',
            st.session_state.api_url,
            f"/assessment/trend/{st.session_state.profile['id']}"
        )
        if response is not None:
            if response.status_code in (200, 201):
                trend = response.json()
            else:
                st.error(f"Ошибка: {response.status_code}")
                st.code(response.text)

        col_trend, col_overall = st.columns([1, 1])

        with col_trend:
            st.markdown('#### Тренд')
            st.metric('Физиология', f"{trend['body_change']:.2f}")
            st.metric('Кардиовыносливость', f"{trend['cardio_change']:.2f}")
            st.metric('Сила', f"{trend['strength_change']:.2f}")
            st.metric('Общая оценка', f"{trend['total_change']:.2f}")

        with col_overall:
            st.markdown('#### Все время')
            st.metric('Физиология', f"{overall['body_change']:.2f}")
            st.metric('Кардиовыносливость', f"{overall['cardio_change']:.2f}")
            st.metric('Сила', f"{overall['strength_change']:.2f}")
            st.metric('Общая оценка', f"{overall['total_change']:.2f}")


def main_page():
    st.sidebar.title('FitControl')
    sidebar = st.sidebar.radio(
        "Меню",
        ['Главная', "Профиль", 'Общая оценка'],
        label_visibility='hidden'
    )

    if sidebar == 'Главная':
        st.title("Главная")
        st.write("Добро пожаловать в фитнес приложение FitControl")

    if sidebar == 'Профиль':
        profile_page()

    if sidebar == 'Общая оценка':
        assessment_page()

    btn = st.sidebar.button("Выйти")
    if btn:
        logout()
        st.rerun()


def main():
    init_state()

    if st.session_state.auth:
        st.set_page_config(layout="wide")
        main_page()
    else:
        auth_page()


if __name__ == "__main__":
    main()
