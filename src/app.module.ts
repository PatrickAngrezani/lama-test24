import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BalancesModule } from './balances/balances.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, BalancesModule, TransactionsModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
