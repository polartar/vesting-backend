import { Permission, PrismaClient, Role } from '@prisma/client';
import OrganizationsJson from '../db/seed.json';

const prisma = new PrismaClient();

const getEmail = (email) => {
  return email.split(' ').join('').toLowerCase();
};

async function registerUser(user) {
  let dbUser = await prisma.user.findFirst({
    where: {
      email: getEmail(user.email),
    },
  });
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        firebaseId: user.id,
        name: user.name,
        email: getEmail(user.email),
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        isActive: true,
        isAdmin: false,
      },
    });
  }

  return dbUser;
}

async function registerUserRole(userId, organizationId, role) {
  let userRole = await prisma.userRole.findFirst({
    where: {
      userId,
      organizationId,
    },
  });
  if (!userRole) {
    userRole = await prisma.userRole.create({
      data: {
        userId,
        organizationId,
        role,
      },
    });
  }
  return userRole;
}

async function registerOrganization(organization, userId) {
  let dbOrg = await prisma.organization.findFirst({
    where: {
      email: getEmail(organization.email),
    },
  });
  if (!dbOrg) {
    dbOrg = await prisma.organization.create({
      data: {
        firebaseId: organization.id,
        name: organization.name,
        email: getEmail(organization.email),
        createdAt: organization.created_at,
        updatedAt: organization.updated_at,
        userId,
      },
    });
  }

  // Create founder role
  let dbFounderRole = await prisma.userRole.findFirst({
    where: {
      userId,
      organizationId: dbOrg.id,
    },
  });
  if (!dbFounderRole) {
    dbFounderRole = await prisma.userRole.create({
      data: {
        userId,
        organizationId: dbOrg.id,
        role: Role.FOUNDER,
      },
    });
  }

  // create founder permission
  let dbFounderPermission = await prisma.userPermission.findFirst({
    where: {
      userId,
      organizationId: dbOrg.id,
    },
  });
  if (!dbFounderPermission) {
    dbFounderPermission = await prisma.userPermission.create({
      data: {
        userId,
        organizationId: dbOrg.id,
        permission: Permission.ADMIN,
      },
    });
  }

  return dbOrg;
}

async function registerToken(token, organizationId) {
  let dbToken = await prisma.token.findFirst({
    where: {
      address: token.address.toLowerCase(),
    },
  });
  if (!dbToken) {
    dbToken = await prisma.token.create({
      data: {
        firebaseId: token.id,
        name: token.name,
        symbol: token.symbol,
        chainId: token.chainId,
        address: token.address.toLowerCase(),
        logo: token.logo,
        isDeployed: true,
        isActive: true,
        createdAt: token.createdAt,
        updatedAt: token.updatedAt,
      },
    });
  }

  let dbOrganizationToken = await prisma.organizationToken.findFirst({
    where: {
      organizationId,
      tokenId: dbToken.id,
    },
  });
  if (!dbOrganizationToken) {
    dbOrganizationToken = await prisma.organizationToken.create({
      data: {
        organizationId,
        tokenId: dbToken.id,
      },
    });
  }

  return dbToken;
}

async function registerContract(contract, tokenId, organizationId) {
  let dbContract = await prisma.vestingContract.findFirst({
    where: {
      address: contract.address.toLowerCase(),
      tokenId,
      organizationId,
    },
  });
  if (!dbContract) {
    dbContract = await prisma.vestingContract.create({
      data: {
        firebaseId: contract.id,
        name: contract.name ?? 'Unnamed',
        chainId: contract.chainId,
        address: contract.address.toLowerCase(),
        isDeployed: true,
        isActive: true,
        organizationId,
        tokenId,
        createdAt: contract.created_at,
        updatedAt: contract.updated_at,
      },
    });
  }
  return dbContract;
}

async function registerVesting(vesting, contractId, tokenId, organizationId) {
  let dbVesting = await prisma.vesting.findFirst({
    where: {
      firebaseId: vesting.id,
    },
  });
  if (!dbVesting) {
    dbVesting = await prisma.vesting.create({
      data: {
        firebaseId: vesting.id,
        amount: vesting.amount,
        name: vesting.name,
        organizationId,
        tokenId,
        vestingContractId: contractId,
        createdAt: vesting.created_at,
        updatedAt: vesting.updated_at,
        startedAt: vesting.started_at,
        endedAt: vesting.ended_at,
        releaseFrequency: vesting.release_frequency,
        releaseFrequencyType: vesting.release_frequency_type,
        cliffDuration: vesting.cliff_duration,
        cliffDurationType: vesting.cliff_duration_type,
        cliffAmount: vesting.cliff_amount,
      },
    });
  }
  return dbVesting;
}

async function registerRecipe(recipe, userId, vestingId, organizationId) {
  let dbRecipe = await prisma.recipe.findFirst({
    where: {
      recipientId: userId,
      vestingId,
      organizationId,
    },
  });
  if (!dbRecipe) {
    dbRecipe = await prisma.recipe.create({
      data: {
        firebaseId: recipe.id,
        recipientId: userId,
        vestingId,
        organizationId,
        allocations: recipe.allocations,
        status: recipe.status,
      },
    });
  }
  return dbRecipe;
}

async function registerWallet(address, userId) {
  let dbWallet = await prisma.wallet.findFirst({
    where: {
      address: address.toLowerCase(),
    },
  });

  if (!dbWallet) {
    dbWallet = await prisma.wallet.create({
      data: {
        address: address.toLowerCase(),
        userId,
      },
    });
  } else {
    if (dbWallet.userId !== userId) {
      console.log('Different wallet owner', {
        userId,
        address,
        ownerUserId: dbWallet.userId,
      });
    }
  }
  return dbWallet;
}

async function registerSafe(safe, organizationId) {
  let dbSafe = await prisma.safeWallet.findFirst({
    where: {
      address: safe.address.toLowerCase(),
    },
  });
  if (!dbSafe) {
    dbSafe = await prisma.safeWallet.create({
      data: {
        firebaseId: safe.id,
        address: safe.address.toLowerCase(),
        chainId: safe.chainId,
        organizationId,
        createdAt: safe.created_at,
        updatedAt: safe.updated_at,
        requiredConfirmations: safe.requiredConfirmations,
      },
    });
  }

  return dbSafe;
}

async function registerSafeOwner(owner, safeWalletId) {
  let safeOwner = await prisma.safeOwner.findFirst({
    where: {
      address: owner.address.toLowerCase(),
      safeWalletId,
    },
  });
  if (!safeOwner) {
    safeOwner = await prisma.safeOwner.create({
      data: {
        safeWalletId,
        address: owner.address.toLowerCase(),
        createdAt: owner.created_at,
        updatedAt: owner.updated_at,
      },
    });
  }
}

export const migrateFirebaseDb = async () => {
  console.log('Seeding firebase data...');
  const organizations = OrganizationsJson;

  for (const organization of organizations) {
    // Create founder user
    const dbFounder = await registerUser(organization.user);

    // Create organization
    const dbOrg = await registerOrganization(organization, dbFounder.id);

    for (const token of organization.tokens) {
      const dbToken = await registerToken(token, dbOrg.id);

      for (const contract of token.vestingContracts) {
        const dbContract = await registerContract(
          contract,
          dbToken.id,
          dbOrg.id
        );
        for (const vesting of contract.vestings) {
          const dbVesting = await registerVesting(
            vesting,
            dbContract.id,
            dbToken.id,
            dbOrg.id
          );
          for (const recipient of vesting.recipients) {
            const dbRecipient = await registerUser(recipient);
            await registerUserRole(dbRecipient.id, dbOrg.id, recipient.role);
            await registerRecipe(
              recipient,
              dbRecipient.id,
              dbVesting.id,
              dbOrg.id
            );
            for (const wallet of recipient.wallets) {
              await registerWallet(wallet.address, dbRecipient.id);
            }
          }
        }
      }
    }

    // Add organization members
    for (const user of organization.members) {
      const dbUser = await registerUser(user);
      await registerUserRole(dbUser.id, dbOrg.id, user.role);
      for (const wallet of user.wallets) {
        await registerWallet(wallet.address, dbUser.id);
      }
    }

    for (const safe of organization.safes) {
      const dbSafe = await registerSafe(safe, dbOrg.id);
      for (const owner of safe.safeOwners) {
        const safeOwner = {
          ...owner,
          created_at: safe.created_at,
          updated_at: safe.updated_at,
        };
        const dbUser = await registerUser(safeOwner);
        await registerWallet(owner.address, dbUser.id);
        await registerSafeOwner(safeOwner, dbSafe.id);
      }
    }
  }

  console.log('Seeding Ended');
};
