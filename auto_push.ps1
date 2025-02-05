while ($true) {
    git add .
    git commit -m "Автоматический коммит"
    git push
    Start-Sleep -Seconds 5 # Задержка перед следующей проверкой
}
