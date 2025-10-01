# TODO: Implementar Agendamento, Backend e IA no App Barbearia

## Passos para Implementar Funcionalidades Avançadas

1. [x] Criar backend simples (Node.js + Express + MongoDB)
   - Criar pasta backend/
   - Instalar dependências: express, mongoose, cors
   - Criar server.js com API para agendamentos

2. [x] Implementar API de agendamentos
   - Endpoint GET /appointments para listar horários disponíveis
   - Endpoint POST /appointments para criar agendamento
   - Modelo de dados para Appointment (barber, date, time, user)

3. [x] Criar novas telas no React Native
   - AppointmentScreen.js: tela principal de agendamento com calendário
   - TimeSelectionScreen.js: seleção de horário
   - PhotoUploadScreen.js: upload de foto para IA com 3 imagens de exemplo

4. [x] Integrar IA para recomendação de corte
   - Simulação com 3 imagens de exemplo após upload

5. [x] Atualizar navegação
   - Adicionar novas telas no Stack Navigator
   - Remover tela de seleção de barbeiro (único barbeiro)

6. [x] Atualizar estilos para preto e amarelo
   - Aplicado em todas as telas, incluindo login

7. [x] Adicionar animações
   - Animações de fade-in nas telas
   - Animações de clique nos botões
   - Calendário com botões circulares
   - Botões arredondados na Home

8. [x] Testar funcionalidades
   - Backend funcionando
   - Agendamento: seleção de data e horário
   - IA: upload e exibição de 3 imagens
   - Navegação entre telas
   - Estilos preto e amarelo aplicados
   - Animações funcionando
