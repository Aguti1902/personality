# 🎯 Dashboard Demo - Instrucciones de Acceso

## ✅ Usuario Demo Configurado

Hemos configurado un usuario de demostración para que puedas explorar el nuevo dashboard sin necesidad de configurar una base de datos.

---

## 🔑 Credenciales del Usuario Demo

```
Email:    demo@personality.co
Password: Demo123!
Nombre:   Usuario Demo
```

---

## 🚀 Cómo Acceder

### Opción 1: Directamente desde el Login (RECOMENDADA)

1. **Asegúrate de que el servidor esté corriendo:**
   ```bash
   npm run dev
   ```

2. **Ve al login:**
   ```
   http://localhost:3000/es/login
   ```

3. **Ingresa las credenciales del usuario demo:**
   - Email: `demo@personality.co`
   - Password: `Demo123!`

4. **Serás redirigido automáticamente al dashboard:**
   ```
   http://localhost:3000/es/dashboard
   ```

### Opción 2: Configuración Manual con HTML

Si prefieres configurar manualmente el usuario demo:

1. **Abre el archivo de configuración:**
   ```
   open setup-demo-user.html
   ```

2. **Haz clic en "Configurar Usuario Demo"**

3. **Ve al login e ingresa las credenciales**

---

## 📊 Características del Dashboard

El nuevo dashboard incluye:

### 🏠 **Secciones Principales:**
- **Did you know?** - Información educativa sobre personalidad
- **Daily Trivia** - Pregunta diaria interactiva con respuestas
- **Daily Streak** - Racha diaria con calendario visual
- **Your Progress** - Estadísticas de:
  - ✅ Tests completados: 5
  - 📚 Cursos finalizados: 2
  - 🏆 Desafíos completados: 3

### 🎨 **Diseño:**
- Layout de 2 columnas (contenido + sidebar)
- Cards modernas con hover effects
- Calendario de racha semanal
- Responsive para móvil y desktop

---

## 🌍 URLs Disponibles

### Dashboard y Perfil:
- Dashboard: `http://localhost:3000/es/dashboard`
- Mi Cuenta: `http://localhost:3000/es/cuenta`

### Tests:
- Test Principal: `http://localhost:3000/es/test`
- ADHD: `http://localhost:3000/es/tests/adhd`
- Ansiedad: `http://localhost:3000/es/tests/anxiety`
- Depresión: `http://localhost:3000/es/tests/depression`
- Personalidad: `http://localhost:3000/es/tests/personality`
- Inteligencia Emocional: `http://localhost:3000/es/tests/eq`

---

## 🔐 Datos del Usuario Demo

El usuario demo incluye:

```javascript
{
  email: "demo@personality.co",
  userName: "Usuario Demo",
  subscriptionStatus: "active",
  completedTests: 5,
  finishedCourses: 2,
  completedChallenges: 3,
  dailyStreak: 3
}
```

---

## 🎯 Cambios Realizados

### 1. **Dashboard Nuevo**
   - ✅ Creado `/app/[lang]/dashboard/page.tsx`
   - ✅ Diseño similar a Personality.co
   - ✅ Todas las traducciones agregadas (9 idiomas)

### 2. **Login Mejorado**
   - ✅ Bypass para usuario demo (sin necesidad de DB)
   - ✅ Tarjeta visible con credenciales
   - ✅ Redirección automática al dashboard

### 3. **Header Actualizado**
   - ✅ No se agregó botón al header (como solicitaste)
   - ✅ Se accede desde el footer/login

### 4. **Traducciones**
   - ✅ Español
   - ✅ Inglés
   - ✅ Francés
   - ✅ Alemán
   - ✅ Italiano
   - ✅ Portugués
   - ✅ Sueco
   - ✅ Noruego
   - ✅ Ucraniano

---

## 📝 Notas Importantes

- ⚠️ El usuario demo **NO requiere base de datos**
- ⚠️ Los datos se guardan solo en **localStorage**
- ⚠️ Perfecto para **desarrollo y demos**
- ⚠️ Para producción, necesitarás configurar PostgreSQL

---

## 🆘 Troubleshooting

### No puedo hacer login
→ Asegúrate de usar las credenciales exactas (case-sensitive):
  - `demo@personality.co` (no Demo@personality.co)
  - `Demo123!` (no demo123!)

### No veo el dashboard
→ El servidor debe estar corriendo en `http://localhost:3000`

### Los datos no aparecen
→ Abre la consola del navegador (F12) y verifica que localStorage tenga los datos

---

## 🎉 ¡Listo!

Ahora puedes explorar el nuevo dashboard y todas sus funcionalidades.

**¿Necesitas ayuda?**
- Revisa la consola del navegador (F12) para ver logs
- Verifica que el servidor esté corriendo
- Asegúrate de estar en `http://localhost:3000/es/login`

